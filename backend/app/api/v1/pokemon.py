import asyncio
from collections.abc import Coroutine
from typing import Any, Optional

import httpx
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"


@router.get("/types")
async def get_pokemon_types():
    """Get all Pokemon types"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{POKEAPI_BASE_URL}/type")
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail="Failed to fetch types"
            )
        data = response.json()
        return [{"name": t["name"]} for t in data["results"]]


async def fetch_pokemon_details(client: httpx.AsyncClient, url: str) -> Optional[dict[str, Any]]:
    """Coroutine to fetch details for a single Pokémon."""
    try:
        response = await client.get(url)
        response.raise_for_status()
        details = response.json()
        return {
            "id": details["id"],
            "name": details["name"],
            "types": [t["type"]["name"] for t in details["types"]],
            "sprites": {"front_default": details["sprites"]["front_default"]},
        }
    except httpx.HTTPStatusError:
        # If a single Pokémon fails, we can choose to return None and filter it out
        return None


@router.get("")  # This will be accessible at /pokemon due to the prefix
async def get_pokemon(
    search: Optional[str] = Query(None),
    types: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    match: str = "all",  # "all" = AND, "any" = OR
):
    """Get Pokemon with optional filtering and optimized data fetching."""
    async with httpx.AsyncClient() as client:
        pokemon_references = []

        if types:
            # Support up to two types
            type_names = [t.strip().lower() for t in types.split(",") if t.strip()][:2]
            type_lists = []
            for type_name in type_names:
                type_response = await client.get(f"{POKEAPI_BASE_URL}/type/{type_name}")
                if type_response.status_code != 200:
                    raise HTTPException(
                        status_code=type_response.status_code,
                        detail=f"Failed to fetch Pokémon for type: {type_name}",
                    )
                type_data = type_response.json()
                type_lists.append([p["pokemon"] for p in type_data["pokemon"]])

            if len(type_lists) == 1:
                pokemon_references = type_lists[0]
            else:
                dicts_by_url = [{p["url"]: p for p in lst} for lst in type_lists]
                if (match or "all").lower() == "any":  # OR
                    merged = {}
                    for d in dicts_by_url:
                        merged.update(d)
                    pokemon_references = list(merged.values())
                else:  # AND (default)
                    common_urls = set(dicts_by_url[0]).intersection(*[set(d) for d in dicts_by_url[1:]])
                    pokemon_references = [dicts_by_url[0][u] for u in common_urls]

            pokemon_references.sort(key=lambda x: x["name"])
        else:
            # Fetch all pokemon references if no type is specified
            all_pokemon_response = await client.get(
                f"{POKEAPI_BASE_URL}/pokemon?limit=2000"
            )
            if all_pokemon_response.status_code != 200:
                raise HTTPException(
                    status_code=all_pokemon_response.status_code,
                    detail="Failed to fetch Pokemon list",
                )
            pokemon_references = all_pokemon_response.json()["results"]

        # Filter by search term if provided
        if search:
            pokemon_references = [
                p for p in pokemon_references if search.lower() in p["name"].lower()
            ]

        # Total count after filtering
        count = len(pokemon_references)

        # Apply pagination to the list of references
        paginated_references = pokemon_references[offset : offset + limit]

        # Concurrently fetch details for the paginated list
        tasks: list[Coroutine[Any, Any, Optional[dict[str, Any]]]] = [
            fetch_pokemon_details(client, p["url"]) for p in paginated_references
        ]
        pokemon_details_results = await asyncio.gather(*tasks)

        # Filter out any None results from failed fetches
        pokemon_details = [p for p in pokemon_details_results if p is not None]

        return {
            "results": pokemon_details,
            "count": count,
            "next": (offset + limit) < count,
            "previous": offset > 0,
        }
