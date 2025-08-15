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
        return None


async def get_pokemon_for_type(
    client: httpx.AsyncClient, type_name: str
) -> list[dict[str, str]]:
    """Fetches a list of pokemon references for a given type."""
    response = await client.get(f"{POKEAPI_BASE_URL}/type/{type_name}")
    if response.status_code != 200:
        raise HTTPException(
            status_code=400, detail=f"Invalid Pokémon type requested: {type_name}"
        )
    return [p["pokemon"] for p in response.json()["pokemon"]]


@router.get("")  # This will be accessible at /pokemon due to the prefix
async def get_pokemon(
    search: Optional[str] = Query(None),
    types: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Get Pokemon with robust server-side filtering and optimized data fetching."""
    async with httpx.AsyncClient() as client:
        pokemon_references = []

        parsed_types = []
        if types:
            parsed_types = [t.strip().lower() for t in types.split(",") if t.strip()]

        if parsed_types:
            # Concurrently fetch Pokémon lists for all specified types
            type_fetch_tasks = [get_pokemon_for_type(client, t) for t in parsed_types]
            list_of_pokemon_lists = await asyncio.gather(*type_fetch_tasks)

            # Create sets of names for efficient intersection
            name_sets = [
                {p["name"] for p in poke_list} for poke_list in list_of_pokemon_lists
            ]

            # Find the intersection of all sets
            if not name_sets:
                intersected_names = set()
            else:
                intersected_names = set.intersection(*name_sets)

            # Create a map of name -> url from the first list to reconstruct references
            # This is safe because any pokemon in the intersection must be in the first list
            name_to_url_map = {p["name"]: p["url"] for p in list_of_pokemon_lists[0]}

            # Reconstruct the pokemon_references list
            pokemon_references = [
                {"name": name, "url": name_to_url_map[name]}
                for name in sorted(list(intersected_names)) # Sort for consistent order
            ]
        else:
            # Fallback: Fetch all pokemon references if no type is specified
            response = await client.get(f"{POKEAPI_BASE_URL}/pokemon?limit=2000")
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code, detail="Failed to fetch Pokemon list"
                )
            pokemon_references = response.json()["results"]

        # Filter by search term if provided
        if search:
            pokemon_references = [
                p for p in pokemon_references if search.lower() in p["name"].lower()
            ]

        # Total count after filtering
        count = len(pokemon_references)

        # Apply pagination
        paginated_references = pokemon_references[offset : offset + limit]

        # Concurrently fetch details for the paginated list
        tasks: list[Coroutine[Any, Any, Optional[dict[str, Any]]]] = [
            fetch_pokemon_details(client, p["url"]) for p in paginated_references
        ]
        results = await asyncio.gather(*tasks)
        pokemon_details = [p for p in results if p is not None]

        return {
            "results": pokemon_details,
            "count": count,
            "next": (offset + limit) < count,
            "previous": offset > 0,
        }
