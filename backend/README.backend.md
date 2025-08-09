# Pokemon Project Backend

This is the backend service for the Pokemon Project, built with FastAPI to provide Pokemon data through a RESTful API. It serves as a proxy to the PokeAPI, with additional caching and filtering capabilities for improved performance and usability.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Query Parameters](#query-parameters)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Response Shape](#response-shape)
- [Filtering Semantics](#filtering-semantics)
- [Examples](#examples)
- [Sample Data Mode](#sample-data-mode)
- [Status Codes](#status-codes)
- [Caching Notes](#caching-notes)

## Features

- **RESTful API**: Access Pokemon data through RESTful API endpoints.
- **Caching**: Built-in response caching for improved performance.
- **Filtering**: Easily search and filter Pokemon by attributes like name, types, and other criteria.
- **Cross-Origin Resource Sharing (CORS)**: Support for CORS to allow access from frontend applications for fullstack integration.
- **Sample Data**: Includes sample data for testing and development purposes without the use of the PokeAPI as an external dependency.

## Tech Stack

- **FastAPI**: The web framework used for building the API.
- **Uvicorn**: The ASGI server for running the FastAPI application.
- **HTTPX**: Asynchronous HTTP client for making requests to the PokeAPI.

## API Endpoints

- `GET /pokemon/types`: Gets a list of all Pokemon types.
- `GET /pokemon/{name_or_id}`: Gets detailed information about a specific Pokemon by name or ID.
- `GET /pokemon`: Gets a list of all Pokemon with optional filtering and pagination.

## Query Parameters

The **/pokemon** endpoint supports the following query parameters:

- **search**: Filter results by a search term (supports partial matches).
- **types**: Comma-separated list of Pokemon types to filter by (supports multiple types).
- **limit**: Maximum number of results to return (1-100, default: 20).
- **offset**: Number of results to skip for pagination.

## Setup & Installation

Prerequisites

- Python 3.11 or higher
- Docker (optional, for containerization)

For local development, you can run the FastAPI application using Uvicorn:

1. Clone the repo.
2. Navigate to the backend directory.

    ```bash
    cd pokemon-project/backend
    ```

3. Create a virtual environment and activate it:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

4. Install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

5. Run the server:

    ```bash
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    ```

Using Docker:
The backend can be run in a Docker container using the provided Dockerfile:

1. Build the Docker image:

    ```bash
    docker build -f Dockerfile.backend.dev -t pokemon-backend .
    ```

2. Run the Docker container:

    ```bash
    docker run -p 8000:8000 pokemon-backend
    ```

Or using docker-compose from the project's root:

```bash
docker-compose -f docker-compose.backend.dev.yml up --build
```

## Configuration

The backend supports the following environment variables:

- **POKEAPI_BASE**: The base URL for the PokeAPI (default: `https://pokeapi.co/api/v2/`).
- **CACHE_TTL_SECONDS**: The time-to-live for cached responses (default: `300` seconds).
- **USE_SAMPLE_DATA**: Use sample data instead of fetching from the PokeAPI (default: `false`).

## API Documentation

Once the server is running, auto-generated API documentation can be found at:

- **Swagger UI**: (<http://localhost:8000/docs>)
- **Redoc Documentation**: (<http://localhost:8000/redoc>)

## Response Shape

To support the frontend card UI, the list endpoint guarantees a minimal “PokemonSummary” shape for each item:

```json
{
  "id": 25,
  "name": "pikachu",
  "types": ["electric"],
  "sprites": {
    "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  }
}
```

Notes:

- types are lowercase strings.
- sprites.front_default may be null if no sprite is available.

The detail endpoint GET /pokemon/{name_or_id} returns additional fields, but at minimum includes the same properties above.

## Filtering Semantics

- search: Case-insensitive partial match on name. Numeric searches match exact ID (e.g., search=25 returns the Pokémon with id 25).
- types: Comma-separated list uses AND semantics. A Pokémon must include all listed types to match (e.g., types=grass,poison returns dual-type Grass/Poison Pokémon).
- Pagination: limit and offset apply after filters. Default limit is 20. Typical bounds are 1–100.

Results are returned in a stable order (by id ascending) unless otherwise specified.

## Examples

- Search by name:
  curl "<http://localhost:8000/pokemon?search=pika&limit=20&offset=0>"

- Search by ID (as text):
  curl "<http://localhost:8000/pokemon?search=25>"

- Filter by one type:
  curl "<http://localhost:8000/pokemon?types=fairy>"

- Filter by two types (AND):
  curl "<http://localhost:8000/pokemon?types=grass,poison>"

- Combine search and types:
  curl "<http://localhost:8000/pokemon?search=char&types=fire&limit=12>"

## Sample Data Mode

When USE_SAMPLE_DATA=true:

- The dataset includes id, name, types, and sprites.front_default for common Pokémon to ensure the card UI renders images.
- If a sprite is missing, sprites.front_default may be null (frontend shows a placeholder).

## Status Codes

- 200: Successful response.
- 400: Invalid query parameters (e.g., non-numeric limit/offset, out-of-range limit).
- 404: GET /pokemon/{name_or_id} not found.
- 5xx: Upstream or internal errors (may be served from cache if available).

## Caching Notes

Responses may be cached according to CACHE_TTL_SECONDS. Cached responses still respect query parameters (search, types, limit, offset) as part of the cache key.
