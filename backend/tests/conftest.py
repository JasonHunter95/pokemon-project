"""
Pytest configuration and shared fixtures for backend tests.
"""

from unittest.mock import AsyncMock, patch

import pytest
from app.main import app
from fastapi.testclient import TestClient


@pytest.fixture
def test_client():
    """Provides a FastAPI TestClient for integration tests."""
    return TestClient(app)


@pytest.fixture
def mock_redis():
    """
    Patches the Redis connection pool with an AsyncMock.
    This prevents tests from requiring a live Redis instance.
    """
    with patch("app.services.pokeapi.redis_pool") as mock_pool:
        mock_pool.get = AsyncMock(return_value=None)  # Simulate cache miss by default
        mock_pool.setex = AsyncMock(return_value=True)
        yield mock_pool


@pytest.fixture
def sample_pokemon_list_response():
    """Sample response data for the /pokemon endpoint."""
    return {
        "results": [
            {
                "id": 25,
                "name": "pikachu",
                "types": ["electric"],
                "sprites": {"front_default": "https://example.com/pikachu.png"},
                "stats": {"hp": 35, "attack": 55, "defense": 40},
            },
            {
                "id": 1,
                "name": "bulbasaur",
                "types": ["grass", "poison"],
                "sprites": {"front_default": "https://example.com/bulbasaur.png"},
                "stats": {"hp": 45, "attack": 49, "defense": 49},
            },
        ],
        "count": 2,
        "next": False,
        "previous": False,
    }


@pytest.fixture
def sample_pokemon_detail():
    """Sample response data for a single Pokemon detail."""
    return {
        "id": 25,
        "name": "pikachu",
        "height": 4,
        "weight": 60,
        "base_experience": 112,
        "sprites": {
            "front_default": "https://example.com/pikachu.png",
            "front_shiny": "https://example.com/pikachu_shiny.png",
        },
        "types": [{"slot": 1, "type": {"name": "electric", "url": "..."}}],
        "stats": [
            {"base_stat": 35, "effort": 0, "stat": {"name": "hp", "url": "..."}},
            {"base_stat": 55, "effort": 0, "stat": {"name": "attack", "url": "..."}},
        ],
        "abilities": [
            {"ability": {"name": "static", "url": "..."}, "is_hidden": False, "slot": 1}
        ],
    }


@pytest.fixture
def sample_types_response():
    """Sample response for the /pokemon/types endpoint."""
    return [
        {"name": "normal"},
        {"name": "fire"},
        {"name": "water"},
        {"name": "electric"},
        {"name": "grass"},
    ]
