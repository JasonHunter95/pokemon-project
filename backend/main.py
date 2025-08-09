import asyncio
import os
import time
from typing import List, Optional, Dict, Any

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

POKEAPI_BASE = os.getenv("POKEAPI_BASE", "https://pokeapi.co/api/v2")
CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL_SECONDS", "300"))  # 5 min

app = FastAPI(title="Pokemon API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:6006"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    data = await _get_json(f"{POKEAPI_BASE}/pokemon/{name_or_id}")
    return _simplify_pokemon(data)

@app.on_event("startup")
async def _startup():
    global _http_client
    _http_client = httpx.AsyncClient(headers={"User-Agent": "pokemon-project/1.0"})

@app.on_event("shutdown")
async def _shutdown():
    global _http_client
    if _http_client:
        await _http_client.aclose()
        _http_client = None

@app.get("/")
async def root():
    return {"status": "ok", "source": "PokeAPI", "base": POKEAPI_BASE}

@app.get("/pokemon/types")
async def get_types():
    data = await _get_json(f"{POKEAPI_BASE}/type")
    # Filter out shadow/unknown if present
    names = [t["name"] for t in data.get("results", []) if t["name"] not in {"shadow", "unknown"}]
    return names

@app.get("/pokemon/{name_or_id}")
async def get_one(name_or_id: str):
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
            page = candidates[offset : offset + limit]
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

# Sample Pokemon data
POKEMON_TYPES = [
    {"id": 1, "name": "Fire", "color": "#EE8130"},
    {"id": 2, "name": "Water", "color": "#6390F0"},
    {"id": 3, "name": "Grass", "color": "#7AC74C"},
    {"id": 4, "name": "Electric", "color": "#F7D02C"},
    {"id": 5, "name": "Psychic", "color": "#F95587"},
    {"id": 6, "name": "Ice", "color": "#96D9D6"},
    {"id": 7, "name": "Dragon", "color": "#6F35FC"},
    {"id": 8, "name": "Dark", "color": "#705746"},
    {"id": 9, "name": "Fairy", "color": "#D685AD"},
    {"id": 10, "name": "Normal", "color": "#A8A878"},
]

SAMPLE_POKEMON = [
    {"id": 1, "name": "Charizard", "types": ["Fire", "Flying"]},
    {"id": 2, "name": "Blastoise", "types": ["Water"]},
    {"id": 3, "name": "Venusaur", "types": ["Grass", "Poison"]},
    {"id": 4, "name": "Pikachu", "types": ["Electric"]},
    {"id": 5, "name": "Alakazam", "types": ["Psychic"]},
    {"id": 6, "name": "Lapras", "types": ["Water", "Ice"]},
]

@app.get("/")
def read_root():
    return {"message": "Pokemon API is running!"}

@app.get("/pokemon/types")
def get_pokemon_types():
    """Get all available Pokemon types"""
    return POKEMON_TYPES

@app.get("/pokemon")
def get_pokemon(types: str = None):
    """Get Pokemon, optionally filtered by types (comma-separated)"""
    if not types:
        return SAMPLE_POKEMON
    
    # Filter by types
    type_list = [t.strip() for t in types.split(",")]
    filtered_pokemon = []
    
    for pokemon in SAMPLE_POKEMON:
        if any(ptype in type_list for ptype in pokemon["types"]):
            filtered_pokemon.append(pokemon)
    
    return filtered_pokemon

@app.get("/pokemon/{pokemon_id}")
def get_pokemon_by_id(pokemon_id: int):
    """Get a specific Pokemon by ID"""
    pokemon = next((p for p in SAMPLE_POKEMON if p["id"] == pokemon_id), None)
    if pokemon:
        return pokemon
    return {"error": "Pokemon not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)