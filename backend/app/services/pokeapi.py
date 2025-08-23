import asyncio
import json
import logging
from typing import Any, Optional

import httpx
import redis.asyncio as redis
from app.core.config import settings

logger = logging.getLogger(__name__)

# Create a Redis connection pool
redis_pool = redis.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)


class PokeAPIService:
    """Service for interacting with the PokeAPI, with Redis caching."""

    def __init__(self):
        self.base_url = settings.pokeapi_base_url
        self.timeout = settings.http_timeout
        self.cache_ttl = settings.cache_ttl  # Use TTL from settings

    async def _get_pokemon_for_type(
        self, client: httpx.AsyncClient, type_name: str
    ) -> list[dict[str, str]]:
        """Fetches a list of pokemon references for a given type from API."""
        response = await client.get(f"{self.base_url}/type/{type_name}")
        response.raise_for_status()
        return [p["pokemon"] for p in response.json()["pokemon"]]

    async def _fetch_pokemon_details(
        self, client: httpx.AsyncClient, url: str
    ) -> Optional[dict[str, Any]]:
        """Fetches and shapes full details for a single Pokémon from API."""
        try:
            response = await client.get(url)
            response.raise_for_status()
            details = response.json()

            # Extract stats for filtering
            stats = {}
            for stat in details["stats"]:
                stat_name = stat["stat"]["name"]
                stats[stat_name] = stat["base_stat"]

            return {
                "id": details["id"],
                "name": details["name"],
                "types": [t["type"]["name"] for t in details["types"]],
                "sprites": {"front_default": details["sprites"]["front_default"]},
                "stats": stats,
            }
        except httpx.HTTPStatusError:
            return None
    async def get_pokemon_detail(self, name_or_id: str) -> dict[str, Any]:
        """Fetch a single Pokémon detail (cached)."""
        cache_key = f"pokemon_detail:{name_or_id}"
        try:
            cached = await redis_pool.get(cache_key)
            if cached:
                logger.info(f"Detail cache hit: {cache_key}")
                return json.loads(cached)
        except Exception as e:
            logger.error(f"Redis GET failed: {e}")

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(f"{self.base_url}/pokemon/{name_or_id}")
            response.raise_for_status()
            data = response.json()

        try:
            await redis_pool.setex(cache_key, self.cache_ttl, json.dumps(data))
            logger.info(f"Detail cached: {cache_key}")
        except Exception as e:
            logger.error(f"Redis SETEX failed: {e}")

        return data

    async def get_pokemon_list(
        self,
        search: Optional[str] = None,
        types: Optional[list[str]] = None,
        stats: Optional[dict[str, dict[str, int]]] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> dict[str, Any]:
        """
        Gets a list of Pokémon, using Redis for caching and optimized filtering.
        """
        # Create a unique cache key based on all query parameters
        stats_key = json.dumps(stats) if stats else ""
        types_key = ','.join(types or [])
        cache_key = (
            f"pokemon_list:search={search or ''}:types={types_key}:"
            f"stats={stats_key}:limit={limit}:offset={offset}"
        )

        # 1. Check cache first
        try:
            cached_data = await redis_pool.get(cache_key)
            if cached_data:
                logger.info(f"Cache hit for key: {cache_key}")
                return json.loads(cached_data)
        except Exception as e:
            logger.error(f"Redis GET failed: {e}")

        logger.info(f"Cache miss for key: {cache_key}")

        # 2. If cache miss, fetch from API
        async with httpx.AsyncClient() as client:
            pokemon_references: list[dict[str, str]] = []

            if types:
                tasks = [self._get_pokemon_for_type(client, t) for t in types]
                list_of_pokemon_lists = await asyncio.gather(*tasks, return_exceptions=True)

                # Filter out any failed requests before processing
                successful_lists = [lst for lst in list_of_pokemon_lists if isinstance(lst, list)]
                if len(successful_lists) != len(types):
                    # Handle error if a type was invalid
                    raise httpx.RequestError("One or more invalid Pokémon types requested.")

                name_sets = [{p["name"] for p in poke_list} for poke_list in successful_lists]
                intersected_names = set.intersection(*name_sets) if name_sets else set()

                name_to_url_map = {p["name"]: p["url"] for p in successful_lists[0]}
                pokemon_references = [
                    {"name": name, "url": name_to_url_map[name]}
                    for name in sorted(list(intersected_names))
                ]
            else:
                response = await client.get(f"{self.base_url}/pokemon?limit=2000")
                response.raise_for_status()
                pokemon_references = response.json()["results"]

            if search:
                pokemon_references = [
                    p for p in pokemon_references if search.lower() in p["name"].lower()
                ]

            # For stat filtering, we need to fetch all details first, then filter
            if stats:
                # Fetch all details for stat filtering
                detail_tasks = [self._fetch_pokemon_details(client, p["url"]) for p in pokemon_references]
                details_results = await asyncio.gather(*detail_tasks)
                all_pokemon_details = [p for p in details_results if p is not None]

                # Apply stat filtering
                filtered_pokemon = []
                for pokemon in all_pokemon_details:
                    matches_stats = True
                    for stat_name, stat_range in stats.items():
                        if stat_name in pokemon.get("stats", {}):
                            pokemon_stat = pokemon["stats"][stat_name]
                            min_val = stat_range.get("min", 0)
                            max_val = stat_range.get("max", 255)
                            if not (min_val <= pokemon_stat <= max_val):
                                matches_stats = False
                                break
                    if matches_stats:
                        filtered_pokemon.append(pokemon)

                # Apply pagination after stat filtering
                count = len(filtered_pokemon)
                final_pokemon_details = filtered_pokemon[offset : offset + limit]
            else:
                # No stat filtering, use normal pagination
                count = len(pokemon_references)
                paginated_refs = pokemon_references[offset : offset + limit]

                detail_tasks = [self._fetch_pokemon_details(client, p["url"]) for p in paginated_refs]
                details_results = await asyncio.gather(*detail_tasks)
                final_pokemon_details = [p for p in details_results if p is not None]

            # 3. Construct the final response object
            response_data = {
                "results": final_pokemon_details,
                "count": count,
                "next": (offset + limit) < count,
                "previous": offset > 0,
            }

            # 4. Store the result in Redis with a TTL (Time-To-Live)
            try:
                await redis_pool.setex(cache_key, self.cache_ttl, json.dumps(response_data))
                logger.info(f"Cached result for key: {cache_key}")
            except Exception as e:
                logger.error(f"Redis SETEX failed: {e}")

            return response_data
