"""
Unit tests for the PokeAPIService class.

These tests verify the service's caching logic, data transformation,
and error handling with fully mocked HTTP and Redis dependencies.
"""

import json
from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest
from app.services.pokeapi import PokeAPIService


@pytest.fixture
def service():
    """Provides a fresh PokeAPIService instance."""
    return PokeAPIService()


@pytest.fixture
def mock_httpx_client():
    """Creates a mock httpx.AsyncClient context manager."""
    mock_client = MagicMock()
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=None)
    return mock_client


class TestGetPokemonDetail:
    """Tests for PokeAPIService.get_pokemon_detail()."""

    @pytest.mark.asyncio
    async def test_returns_cached_data_on_cache_hit(self, service, mock_redis):
        """Should return cached data without hitting the API."""
        cached_data = {"id": 25, "name": "pikachu"}
        mock_redis.get.return_value = json.dumps(cached_data)

        with patch("app.services.pokeapi.redis_pool", mock_redis):
            result = await service.get_pokemon_detail("pikachu")

        assert result == cached_data
        mock_redis.get.assert_called_once_with("pokemon_detail:pikachu")

    @pytest.mark.asyncio
    async def test_fetches_from_api_on_cache_miss(
        self, service, mock_redis, mock_httpx_client, sample_pokemon_detail
    ):
        """Should fetch from PokeAPI and cache the result on cache miss."""
        mock_redis.get.return_value = None  # Cache miss

        mock_response = MagicMock()
        mock_response.json.return_value = sample_pokemon_detail
        mock_response.raise_for_status = MagicMock()
        mock_httpx_client.get = AsyncMock(return_value=mock_response)

        with patch("app.services.pokeapi.redis_pool", mock_redis):
            with patch("httpx.AsyncClient", return_value=mock_httpx_client):
                result = await service.get_pokemon_detail("pikachu")

        assert result["name"] == "pikachu"
        mock_redis.setex.assert_called_once()

    @pytest.mark.asyncio
    async def test_raises_on_upstream_error(self, service, mock_redis, mock_httpx_client):
        """Should propagate HTTPStatusError from upstream API."""
        mock_redis.get.return_value = None

        mock_response = MagicMock()
        mock_response.status_code = 404
        mock_httpx_client.get = AsyncMock(
            side_effect=httpx.HTTPStatusError(
                "Not Found", request=MagicMock(), response=mock_response
            )
        )

        with patch("app.services.pokeapi.redis_pool", mock_redis):
            with patch("httpx.AsyncClient", return_value=mock_httpx_client):
                with pytest.raises(httpx.HTTPStatusError):
                    await service.get_pokemon_detail("fakemon")


class TestGetPokemonList:
    """Tests for PokeAPIService.get_pokemon_list()."""

    @pytest.mark.asyncio
    async def test_returns_cached_list_on_cache_hit(self, service, mock_redis):
        """Should return cached list data without API calls."""
        cached_response = {
            "results": [{"id": 1, "name": "bulbasaur"}],
            "count": 1,
            "next": False,
            "previous": False,
        }
        mock_redis.get.return_value = json.dumps(cached_response)

        with patch("app.services.pokeapi.redis_pool", mock_redis):
            result = await service.get_pokemon_list(limit=20, offset=0)

        assert result == cached_response
        assert len(result["results"]) == 1

    @pytest.mark.asyncio
    async def test_filters_by_search_term(
        self, service, mock_redis, mock_httpx_client
    ):
        """Should filter Pokemon by name search."""
        mock_redis.get.return_value = None

        # Mock the list response
        list_response = MagicMock()
        list_response.json.return_value = {
            "results": [
                {"name": "pikachu", "url": "https://pokeapi.co/api/v2/pokemon/25/"},
                {"name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/"},
            ]
        }
        list_response.raise_for_status = MagicMock()

        # Mock the detail response for pikachu
        detail_response = MagicMock()
        detail_response.json.return_value = {
            "id": 25,
            "name": "pikachu",
            "types": [{"type": {"name": "electric"}}],
            "sprites": {"front_default": "..."},
            "stats": [{"stat": {"name": "hp"}, "base_stat": 35}],
        }
        detail_response.raise_for_status = MagicMock()

        mock_httpx_client.get = AsyncMock(
            side_effect=[list_response, detail_response]
        )

        with patch("app.services.pokeapi.redis_pool", mock_redis):
            with patch("httpx.AsyncClient", return_value=mock_httpx_client):
                result = await service.get_pokemon_list(search="pika", limit=20, offset=0)

        # Should only return pikachu (filtered by search)
        assert result["count"] == 1
        assert result["results"][0]["name"] == "pikachu"

    @pytest.mark.asyncio
    async def test_stat_filtering_applies_correctly(
        self, service, mock_redis, mock_httpx_client
    ):
        """Should filter Pokemon by stat ranges."""
        mock_redis.get.return_value = None

        # Mock list response
        list_response = MagicMock()
        list_response.json.return_value = {
            "results": [
                {"name": "pikachu", "url": "https://pokeapi.co/api/v2/pokemon/25/"},
            ]
        }
        list_response.raise_for_status = MagicMock()

        # Mock detail response with high HP
        detail_response = MagicMock()
        detail_response.json.return_value = {
            "id": 25,
            "name": "pikachu",
            "types": [{"type": {"name": "electric"}}],
            "sprites": {"front_default": "..."},
            "stats": [{"stat": {"name": "hp"}, "base_stat": 100}],
        }
        detail_response.raise_for_status = MagicMock()

        mock_httpx_client.get = AsyncMock(
            side_effect=[list_response, detail_response]
        )

        with patch("app.services.pokeapi.redis_pool", mock_redis):
            with patch("httpx.AsyncClient", return_value=mock_httpx_client):
                # Filter for HP >= 50
                result = await service.get_pokemon_list(
                    stats={"hp": {"min": 50, "max": 255}},
                    limit=20,
                    offset=0,
                )

        assert result["count"] == 1
        assert result["results"][0]["stats"]["hp"] == 100


class TestFetchPokemonDetails:
    """Tests for the internal _fetch_pokemon_details method."""

    @pytest.mark.asyncio
    async def test_returns_none_on_http_error(self, service, mock_httpx_client):
        """Should return None instead of raising on HTTP errors."""
        mock_httpx_client.get = AsyncMock(
            side_effect=httpx.HTTPStatusError(
                "Server Error", request=MagicMock(), response=MagicMock()
            )
        )

        result = await service._fetch_pokemon_details(
            mock_httpx_client, "https://pokeapi.co/api/v2/pokemon/0/"
        )

        assert result is None
