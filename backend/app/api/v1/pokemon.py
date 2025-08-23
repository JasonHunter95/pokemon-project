from typing import Optional

import httpx
from app.services.pokeapi import PokeAPIService
from fastapi import APIRouter, Depends, HTTPException, Query

router = APIRouter()

POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"

# Dependency to get an instance of our service
def get_pokeapi_service():
    return PokeAPIService()

@router.get("/types")
async def get_pokemon_types():
    """Get all Pokemon types"""
    # This endpoint is simple and can remain here for now.
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{POKEAPI_BASE_URL}/type")
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail="Failed to fetch types"
            )
        data = response.json()
        return [{"name": t["name"]} for t in data["results"]]

@router.get("")
async def get_pokemon(
    search: Optional[str] = Query(None),
    types: Optional[str] = Query(None),
    stats: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    service: PokeAPIService = Depends(get_pokeapi_service),
):
    """
    Get Pokemon with server-side filtering, now powered by a caching service.
    """
    try:
        parsed_types = [t.strip().lower() for t in types.split(",")] if types else None
        parsed_stats = None
        if stats:
            try:
                import json
                parsed_stats = json.loads(stats)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid stats filter format")

        pokemon_data = await service.get_pokemon_list(
            search=search, types=parsed_types, stats=parsed_stats, limit=limit, offset=offset
        )
        return pokemon_data
    except httpx.RequestError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        # Generic error for other unexpected issues
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.get("/{name_or_id}")
async def get_pokemon_detail(
    name_or_id: str,
    service: PokeAPIService = Depends(get_pokeapi_service),
):
    """Get detailed info for a specific Pokémon by name or ID."""
    try:
        return await service.get_pokemon_detail(name_or_id)
    except httpx.HTTPStatusError as e:
        if e.response is not None and e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Pokemon not found")
        raise HTTPException(status_code=502, detail="Upstream PokeAPI error")
    except Exception:
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
