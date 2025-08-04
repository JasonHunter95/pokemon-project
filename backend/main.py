from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Pokemon API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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