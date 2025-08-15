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
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    service: PokeAPIService = Depends(get_pokeapi_service),
):
    """
    Get Pokemon with server-side filtering, now powered by a caching service.
    """
    try:
        parsed_types = [t.strip().lower() for t in types.split(",")] if types else None

        pokemon_data = await service.get_pokemon_list(
            search=search, types=parsed_types, limit=limit, offset=offset
        )
        return pokemon_data
    except httpx.RequestError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        # Generic error for other unexpected issues
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
