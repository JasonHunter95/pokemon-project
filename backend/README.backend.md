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
S
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
