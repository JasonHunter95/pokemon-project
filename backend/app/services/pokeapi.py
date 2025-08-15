import logging
import time
from typing import Any, Optional

import httpx
from app.core.config import settings
from app.schemas.pokemon import PokemonBasic, PokemonDetail, PokemonListResponse

logger = logging.getLogger(__name__)

class PokemonCache:
    """Enhanced in-memory cache with TTL and size limits"""

    def __init__(self, max_size: int = None, ttl: int = None):
        self.max_size = max_size or settings.max_cache_size
        self.ttl = ttl or settings.cache_ttl
        self._cache: dict[str, Any] = {}
        self._timestamps: dict[str, float] = {}
        self._access_order: list[str] = []  # For LRU eviction

    def _is_expired(self, key: str) -> bool:
        """Check if cache entry is expired"""
        if key not in self._timestamps:
            return True
        return time.time() - self._timestamps[key] > self.ttl

    def _evict_lru(self):
        """Evict least recently used item"""
        if self._access_order:
            lru_key = self._access_order.pop(0)
            self._cache.pop(lru_key, None)
            self._timestamps.pop(lru_key, None)

    def _update_access(self, key: str):
        """Update access order for LRU"""
        if key in self._access_order:
            self._access_order.remove(key)
        self._access_order.append(key)

    def get(self, key: str) -> Optional[Any]:
        """Get item from cache"""
        if key not in self._cache or self._is_expired(key):
            # Clean up expired entry
            self._cache.pop(key, None)
            self._timestamps.pop(key, None)
            if key in self._access_order:
                self._access_order.remove(key)
            return None

        self._update_access(key)
        return self._cache[key]

    def set(self, key: str, value: Any) -> None:
        """Set item in cache"""
        # Evict if at max size
        if len(self._cache) >= self.max_size and key not in self._cache:
            self._evict_lru()

        self._cache[key] = value
        self._timestamps[key] = time.time()
        self._update_access(key)

    def clear(self) -> None:
        """Clear all cache entries"""
        self._cache.clear()
        self._timestamps.clear()
        self._access_order.clear()

    def size(self) -> int:
        """Get current cache size"""
        return len(self._cache)

# Global cache instance
pokemon_cache = PokemonCache()

class PokeAPIService:
    """Enhanced service for interacting with the PokeAPI"""

    def __init__(self):
        self.base_url = settings.pokeapi_base_url
        self.timeout = settings.http_timeout
        self._client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self):
        """Async context manager entry"""
        self._client = httpx.AsyncClient(
            timeout=httpx.Timeout(self.timeout),
            limits=httpx.Limits(max_keepalive_connections=5, max_connections=10)
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self._client:
            await self._client.aclose()

    async def _make_request(self, endpoint: str) -> dict[str, Any]:
        """Make a request to the PokeAPI with comprehensive error handling"""
        if not self._client:
            raise RuntimeError("Service not initialized. Use as async context manager.")

        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        try:
            logger.info(f"Making request to: {url}")
            response = await self._client.get(url)
            response.raise_for_status()
            return response.json()

        except httpx.TimeoutException:
            logger.error(f"Timeout error for URL: {url}")
            raise httpx.RequestError(f"Request timeout for {url}")
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP {e.response.status_code} error for URL: {url}")
            raise
        except httpx.RequestError as e:
            logger.error(f"Request error for URL {url}: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error for URL {url}: {e}")
            raise

    async def get_pokemon_list(self, limit: int = 20, offset: int = 0) -> PokemonListResponse:
        """Get a paginated list of Pokemon"""
        cache_key = f"pokemon_list_{limit}_{offset}"

        # Check cache first
        cached_data = pokemon_cache.get(cache_key)
        if cached_data:
            logger.info(f"Cache hit for {cache_key}")
            return PokemonListResponse(**cached_data)

        # Fetch from API
        endpoint = f"pokemon?limit={limit}&offset={offset}"
        data = await self._make_request(endpoint)

        # Cache the result
        pokemon_cache.set(cache_key, data)
        logger.info(f"Cached result for {cache_key}")

        return PokemonListResponse(**data)

    async def get_pokemon_detail(self, pokemon_name_or_id: str) -> PokemonDetail:
        """Get detailed information about a specific Pokemon"""
        cache_key = f"pokemon_detail_{pokemon_name_or_id.lower()}"

        # Check cache first
        cached_data = pokemon_cache.get(cache_key)
        if cached_data:
            logger.info(f"Cache hit for {cache_key}")
            return PokemonDetail(**cached_data)

        # Fetch from API
        endpoint = f"pokemon/{pokemon_name_or_id.lower()}"
        data = await self._make_request(endpoint)

        # Cache the result
        pokemon_cache.set(cache_key, data)
        logger.info(f"Cached result for {cache_key}")

        return PokemonDetail(**data)

    async def search_pokemon(self, query: str, limit: int = 10) -> list[PokemonBasic]:
        """Search for Pokemon by name"""
        cache_key = f"pokemon_search_{query.lower()}_{limit}"

        # Check cache first
        cached_data = pokemon_cache.get(cache_key)
        if cached_data:
            logger.info(f"Cache hit for {cache_key}")
            return [PokemonBasic(**item) for item in cached_data]

        # Get a larger list and filter (in production, you'd want a better search mechanism)
        pokemon_list = await self.get_pokemon_list(limit=1200)  # Get more Pokemon for better search

        filtered_results = [
            pokemon for pokemon in pokemon_list.results
            if query.lower() in pokemon.name.lower()
        ][:limit]

        # Cache the results
        cached_results = [pokemon.dict() for pokemon in filtered_results]
        pokemon_cache.set(cache_key, cached_results)
        logger.info(f"Cached search results for {cache_key}")

        return filtered_results

    async def get_cache_stats(self) -> dict[str, Any]:
        """Get cache statistics"""
        return {
            "cache_size": pokemon_cache.size(),
            "max_cache_size": pokemon_cache.max_size,
            "cache_ttl": pokemon_cache.ttl
        }

# Dependency function
async def get_pokeapi_service() -> PokeAPIService:
    """Dependency to get PokeAPI service"""
    return PokeAPIService()
