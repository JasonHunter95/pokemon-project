from typing import Optional

from pydantic import BaseModel


class PokemonBasic(BaseModel):
    name: str
    url: str

class PokemonListResponse(BaseModel):
    count: int
    next: Optional[str] = None
    previous: Optional[str] = None
    results: list[PokemonBasic]

class PokemonSprites(BaseModel):
    front_default: Optional[str] = None
    front_shiny: Optional[str] = None
    back_default: Optional[str] = None
    back_shiny: Optional[str] = None
    front_female: Optional[str] = None
    back_female: Optional[str] = None

class PokemonTypeInfo(BaseModel):
    name: str
    url: str

class PokemonType(BaseModel):
    slot: int
    type: PokemonTypeInfo

class PokemonStatInfo(BaseModel):
    name: str
    url: str

class PokemonStat(BaseModel):
    base_stat: int
    effort: int
    stat: PokemonStatInfo

class PokemonAbilityInfo(BaseModel):
    name: str
    url: str

class PokemonAbility(BaseModel):
    ability: PokemonAbilityInfo
    is_hidden: bool
    slot: int

class PokemonDetail(BaseModel):
    id: int
    name: str
    height: int
    weight: int
    base_experience: Optional[int] = None
    sprites: PokemonSprites
    types: list[PokemonType]
    stats: list[PokemonStat]
    abilities: list[PokemonAbility]

class PokemonSearchResponse(BaseModel):
    results: list[PokemonBasic]
    total_found: int
