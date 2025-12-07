"""
Integration tests for the Pokemon API endpoints.

These tests use mocked external services (PokeAPI, Redis) to verify
that the API routes correctly handle requests and return expected responses.
"""

from unittest.mock import AsyncMock, MagicMock, patch

import httpx


class TestHealthEndpoint:
    """Tests for the /health endpoint."""

    def test_health_check_returns_200(self, test_client):
        """Health check should return 200 with status healthy."""
        response = test_client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}


class TestTypesEndpoint:
    """Tests for the /pokemon/types endpoint."""

    def test_get_types_returns_list(self, test_client):
        """Should return a list of Pokemon types from PokeAPI."""
        mock_response_data = {
            "results": [
                {"name": "normal", "url": "..."},
                {"name": "fire", "url": "..."},
                {"name": "water", "url": "..."},
            ]
        }

        with patch("httpx.AsyncClient") as MockClient:
            mock_client_instance = MagicMock()
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.json.return_value = mock_response_data

            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            MockClient.return_value = mock_client_instance

            response = test_client.get("/pokemon/types")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 3
        assert data[0] == {"name": "normal"}


class TestPokemonListEndpoint:
    """Tests for the GET /pokemon endpoint."""

    def test_get_pokemon_list_returns_results(
        self, test_client, mock_redis, sample_pokemon_list_response
    ):
        """Should return a paginated list of Pokemon."""
        with patch(
            "app.services.pokeapi.PokeAPIService.get_pokemon_list",
            new_callable=AsyncMock,
        ) as mock_get_list:
            mock_get_list.return_value = sample_pokemon_list_response

            response = test_client.get("/pokemon?limit=20&offset=0")

        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert "count" in data
        assert len(data["results"]) == 2
        assert data["results"][0]["name"] == "pikachu"

    def test_get_pokemon_list_with_search(
        self, test_client, mock_redis, sample_pokemon_list_response
    ):
        """Should filter results by search query."""
        filtered_response = {
            **sample_pokemon_list_response,
            "results": [sample_pokemon_list_response["results"][0]],
            "count": 1,
        }

        with patch(
            "app.services.pokeapi.PokeAPIService.get_pokemon_list",
            new_callable=AsyncMock,
        ) as mock_get_list:
            mock_get_list.return_value = filtered_response

            response = test_client.get("/pokemon?search=pikachu")

        assert response.status_code == 200
        data = response.json()
        assert data["count"] == 1
        assert data["results"][0]["name"] == "pikachu"

    def test_get_pokemon_list_with_type_filter(
        self, test_client, mock_redis, sample_pokemon_list_response
    ):
        """Should filter results by Pokemon type."""
        with patch(
            "app.services.pokeapi.PokeAPIService.get_pokemon_list",
            new_callable=AsyncMock,
        ) as mock_get_list:
            mock_get_list.return_value = sample_pokemon_list_response

            response = test_client.get("/pokemon?types=electric")

        assert response.status_code == 200
        mock_get_list.assert_called_once()
        # Verify that types were passed to the service
        call_kwargs = mock_get_list.call_args.kwargs
        assert call_kwargs["types"] == ["electric"]

    def test_get_pokemon_list_invalid_stats_returns_400(self, test_client, mock_redis):
        """Should return 400 for malformed stats filter."""
        response = test_client.get("/pokemon?stats=invalid_json")
        assert response.status_code == 400
        assert "Invalid stats filter format" in response.json()["detail"]


class TestPokemonDetailEndpoint:
    """Tests for the GET /pokemon/{name_or_id} endpoint."""

    def test_get_pokemon_detail_by_name(
        self, test_client, mock_redis, sample_pokemon_detail
    ):
        """Should return details for a Pokemon by name."""
        with patch(
            "app.services.pokeapi.PokeAPIService.get_pokemon_detail",
            new_callable=AsyncMock,
        ) as mock_get_detail:
            mock_get_detail.return_value = sample_pokemon_detail

            response = test_client.get("/pokemon/pikachu")

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "pikachu"
        assert data["id"] == 25

    def test_get_pokemon_detail_by_id(
        self, test_client, mock_redis, sample_pokemon_detail
    ):
        """Should return details for a Pokemon by ID."""
        with patch(
            "app.services.pokeapi.PokeAPIService.get_pokemon_detail",
            new_callable=AsyncMock,
        ) as mock_get_detail:
            mock_get_detail.return_value = sample_pokemon_detail

            response = test_client.get("/pokemon/25")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 25

    def test_get_pokemon_detail_not_found(self, test_client, mock_redis):
        """Should return 404 for non-existent Pokemon."""
        mock_response = MagicMock()
        mock_response.status_code = 404

        with patch(
            "app.services.pokeapi.PokeAPIService.get_pokemon_detail",
            new_callable=AsyncMock,
        ) as mock_get_detail:
            mock_get_detail.side_effect = httpx.HTTPStatusError(
                "Not Found",
                request=MagicMock(),
                response=mock_response,
            )

            response = test_client.get("/pokemon/notarealpokemon")

        assert response.status_code == 404
        assert response.json()["detail"] == "Pokemon not found"
