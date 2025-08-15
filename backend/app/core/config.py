
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # API Configuration
    api_v1_prefix: str = "/api/v1"
    project_name: str = "Pokedex"
    debug: bool = True

    # CORS Configuration
    allowed_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # External APIs
    pokeapi_base_url: str = "https://pokeapi.co/api/v2"

    # Redis Configuration (default if not using docker, but I override it in docker-compose)
    redis_url: str = "redis://localhost:6379"

    # Cache Configuration
    cache_ttl: int = 3600  # 1 hour in seconds
    max_cache_size: int = 1000  # Maximum number of cached items

    # HTTP Client Configuration
    http_timeout: int = 30

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
