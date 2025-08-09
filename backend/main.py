import asyncio
import os
import time
from typing import List, Optional, Dict, Any

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

# Configuration
POKEAPI_BASE = os.getenv("POKEAPI_BASE", "https://pokeapi.co/api/v2")
CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL_SECONDS", "300"))  # 5 min
USE_SAMPLE_DATA = os.getenv("USE_SAMPLE_DATA", "").lower() in ("true", "1", "yes")

app = FastAPI(title="Pokemon API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:6006"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caching mechanism
_http_client: httpx.AsyncClient | None = None
_cache: Dict[str, tuple[float, Any]] = {}

def _cache_get(key: str):
    ent = _cache.get(key)
    if not ent:
        return None
    exp, value = ent
    if time.time() > exp:
        _cache.pop(key, None)
        return None
    return value

def _cache_set(key: str, value: Any, ttl: int = CACHE_TTL_SECONDS):
    _cache[key] = (time.time() + ttl, value)

# API request helpers
async def _get_json(url: str):
    cached = _cache_get(url)
    if cached is not None:
        return cached
    assert _http_client is not None
    r = await _http_client.get(url, timeout=20)
    if r.status_code == 404:
        raise HTTPException(status_code=404, detail="Not found")
    r.raise_for_status()
    data = r.json()
    _cache_set(url, data)
    return data

def _simplify_pokemon(p: dict) -> dict:
    """Convert raw Pokemon data to a simplified format"""
    return {
        "id": p.get("id"),
        "name": p.get("name"),
        "height": p.get("height"),
        "weight": p.get("weight"),
        "types": [t["type"]["name"] for t in p.get("types", [])],
        "sprites": {
            "front_default": p.get("sprites", {}).get("front_default"),
            "other": p.get("sprites", {}).get("other", {}),
        },
        "stats": {s["stat"]["name"]: s["base_stat"] for s in p.get("stats", [])},
    }

async def _fetch_pokemon_detail(name_or_id: str) -> dict:
    """Fetch detailed information for a specific Pokemon"""
    data = await _get_json(f"{POKEAPI_BASE}/pokemon/{name_or_id}")
    return _simplify_pokemon(data)

# Sample data for testing or fallback
SAMPLE_POKEMON_TYPES = [
    {"id": 1, "name": "fire", "color": "#EE8130"},
    {"id": 2, "name": "water", "color": "#6390F0"},
    {"id": 3, "name": "grass", "color": "#7AC74C"},
    {"id": 4, "name": "electric", "color": "#F7D02C"},
    {"id": 5, "name": "psychic", "color": "#F95587"},
    {"id": 6, "name": "ice", "color": "#96D9D6"},
    {"id": 7, "name": "dragon", "color": "#6F35FC"},
    {"id": 8, "name": "dark", "color": "#705746"},
    {"id": 9, "name": "fairy", "color": "#D685AD"},
    {"id": 10, "name": "normal", "color": "#A8A878"},
]

SAMPLE_POKEMONS = [
    {"id": 1, "name": "charizard", "types": ["fire", "flying"]},
    {"id": 2, "name": "blastoise", "types": ["water"]},
    {"id": 3, "name": "venusaur", "types": ["grass", "poison"]},
    {"id": 4, "name": "pikachu", "types": ["electric"]},
    {"id": 5, "name": "alakazam", "types": ["psychic"]},
    {"id": 6, "name": "lapras", "types": ["water", "ice"]},
]

# Lifecycle events
@app.on_event("startup")
async def _startup():
    global _http_client
    if not USE_SAMPLE_DATA:
        _http_client = httpx.AsyncClient(headers={"User-Agent": "pokemon-project/1.0"})

@app.on_event("shutdown")
async def _shutdown():
    global _http_client
    if _http_client:
        await _http_client.aclose()
        _http_client = None

# API endpoints
@app.get("/")
async def root():
    """API health check and information endpoint"""
    if USE_SAMPLE_DATA:
        return {"message": "Pokemon API is running with sample data"}
    return {"status": "ok", "source": "PokeAPI", "base": POKEAPI_BASE}

@app.get("/pokemon/types")
async def get_types():
    """Get all available Pokemon types"""
    if USE_SAMPLE_DATA:
        return [t["name"] for t in SAMPLE_POKEMON_TYPES]
    
    data = await _get_json(f"{POKEAPI_BASE}/type")
    # Filter out shadow/unknown if present
    names = [t["name"] for t in data.get("results", []) if t["name"] not in {"shadow", "unknown"}]
    return names

@app.get("/pokemon/{name_or_id}")
async def get_one(name_or_id: str):
    """Get a specific Pokemon by name or ID"""
    if USE_SAMPLE_DATA:
        # Try to match by ID first, then by name
        try:
            pokemon_id = int(name_or_id)
            pokemon = next((p for p in SAMPLE_POKEMONS if p["id"] == pokemon_id), None)
        except ValueError:
            # Not an integer, try name match
            pokemon = next((p for p in SAMPLE_POKEMONS if p["name"].lower() == name_or_id.lower()), None)
        
        if pokemon:
            return pokemon
        raise HTTPException(status_code=404, detail="Pokemon not found")
    
    try:
        return await _fetch_pokemon_detail(name_or_id.lower())
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=502, detail="Upstream error")

@app.get("/pokemon")
async def list_pokemon(
    search: Optional[str] = None,
    types: Optional[str] = Query(default=None, description="Comma-separated type names"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    """List Pokemon with optional filtering by search term or types"""
    if USE_SAMPLE_DATA:
        results = SAMPLE_POKEMONS.copy()
        
        # Filter by search term if provided
        if search:
            results = [p for p in results if search.lower() in p["name"].lower()]
        
        # Filter by types if provided
        if types:
            type_list = [t.strip().lower() for t in types.split(",") if t.strip()]
            if type_list:
                results = [p for p in results if any(t in p["types"] for t in type_list)]
        
        # Apply pagination
        return results[offset:offset + limit]
    
    # Using real PokeAPI
    # search takes precedence
    if search:
        try:
            p = await _fetch_pokemon_detail(search.lower())
            return [p]
        except HTTPException as e:
            if e.status_code == 404:
                return []
            raise

    type_list: List[str] = []
    if types:
        type_list = [t.strip().lower() for t in types.split(",") if t.strip()]

    try:
        if type_list:
            # Intersect pokemon sets from each type endpoint
            type_pokemon_sets = []
            for t in type_list:
                td = await _get_json(f"{POKEAPI_BASE}/type/{t}")
                names = {entry["pokemon"]["name"] for entry in td.get("pokemon", [])}
                type_pokemon_sets.append(names)
            if not type_pokemon_sets:
                candidates: List[str] = []
            else:
                inter = set.intersection(*type_pokemon_sets)
                candidates = sorted(list(inter))
            # Pagination over candidate names
            page = candidates[offset:offset + limit]
            # Fetch details concurrently with bounded concurrency
            sem = asyncio.Semaphore(10)
            async def fetch_guard(n):
                async with sem:
                    return await _fetch_pokemon_detail(n)
            results = await asyncio.gather(*[fetch_guard(n) for n in page])
            return results

        # Default: page through PokeAPI index then hydrate details
        idx = await _get_json(f"{POKEAPI_BASE}/pokemon?limit={limit}&offset={offset}")
        names = [r["name"] for r in idx.get("results", [])]
        sem = asyncio.Semaphore(10)
        async def fetch_guard(n):
            async with sem:
                return await _fetch_pokemon_detail(n)
        results = await asyncio.gather(*[fetch_guard(n) for n in names])
        return results
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=502, detail="Upstream error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)