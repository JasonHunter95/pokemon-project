from typing import Optional

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
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch types")
        data = response.json()
        return [{"name": t["name"]} for t in data["results"]]

@router.get("")  # This will be accessible at /pokemon due to the prefix
async def get_pokemon(
    search: Optional[str] = Query(None),
    types: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get Pokemon with optional filtering"""
    async with httpx.AsyncClient() as client:
        # Get all pokemon (limited for this example)
        response = await client.get(f"{POKEAPI_BASE_URL}/pokemon?limit=1000")
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch Pokemon")

        all_pokemon = response.json()["results"]

        # Filter by search term if provided
        if search:
            all_pokemon = [p for p in all_pokemon if search.lower() in p["name"].lower()]

        # Apply pagination
        paginated = all_pokemon[offset:offset + limit]

        # Fetch details for each Pokemon
        pokemon_details = []
        for pokemon in paginated:
            detail_response = await client.get(pokemon["url"])
            if detail_response.status_code == 200:
                details = detail_response.json()
                pokemon_details.append({
                    "id": details["id"],
                    "name": details["name"],
                    "types": [t["type"]["name"] for t in details["types"]],
                    "sprites": {
                        "front_default": details["sprites"]["front_default"]
                    }
                })

        return {
            "results": pokemon_details,
            "count": len(all_pokemon),
            "next": offset + limit < len(all_pokemon),
            "previous": offset > 0
        }
