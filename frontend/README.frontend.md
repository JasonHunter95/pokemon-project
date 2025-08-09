# Pokemon Project Frontend

This is the frontend application for the Pokemon Project, built with React to provide a interactive user interface for exploring Pokemon data. It features a responsive design with component-based architecture and comprehensive testing support.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Components](#components)
- [API Integration](#api-integration)
- [Setup & Installation](#setup--installation)
- [Available Scripts](#available-scripts)
- [Storybook](#storybook)
- [Configuration](#configuration)
- [Testing](#testing)

## Features

- **Search by Name**: Quickly find Pokemon by their name.
- **Filter by Type**: Narrow down results by selecting specific Pokemon types (support for two types).
- **Data Display**: Presents Pokemon data in an aesthetically pleasing manner, with type categorizations and more...
- **Responsive Design**: Mobile-friendly layout for seamless use on any device.
- **Component-Based Architecture**: Built with reusable components for better maintainability and scalability in Storybook.
- **Card-Based Results Grid**: Search/filter results render as responsive Pokémon cards showing image, name, ID, and type chips.
- **Inline Actions**: Clicking a type chip refines filters by that type; clicking the card or name navigates (stub link until routing).
- **Loading/Empty/Error States**: Skeleton cards during loading, clear empty state messaging, and error display.

## Tech Stack

- **React**: The Frontend JavaScript library for building UI components.
- **Storybook**: Isolated UI component development environment for building, testing, and showcasing components without the need for the full application's context.
- **CSS Modules**: Scoped CSS for modular and reusable styles.
- **MSW (Mock Service Worker)**: API mocking library for testing and development.
- **React Testing Library (RTL)**: Component and integration testing.

## Components

Core Components:

- **SearchBar**: Input field for searching Pokemon by name.
- **TypeButton**: Button component for selecting Pokemon types.
- **TypeButtonGroup**: Grouping component for managing multiple TypeButton selections (multi-select support for up to two types).
- **PokemonCard**: Displays a single Pokémon (sprite, id, name, type chips) with accessible links and actions. Styles in `components/pokemon-card.css`.
- **PokemonCardGrid**: Responsive grid layout for cards. Styles in `components/pokemon-grid.css`.

Storybook Integration:

The project uses Storybook to develop and document UI components in isolation:

- **SearchBar.stories.js**: Storybook file for the SearchBar component.
- **TypeButton.stories.js**: Storybook file for the TypeButton component.
- **TypeButtonGroup.stories.js**: Storybook file for the TypeButtonGroup component.
- **PokemonCard.stories.jsx**: Stories for default, multiple types, missing sprite, with actions, and in-grid layouts.

## API Integration

The frontend communicates with the backend API to fetch Pokemon data using the following services:

- **api.js**: API client functions for fetching Pokemon data.
  - `fetchTypes()` - Retrieves the list of Pokemon types from the backend API.
  - `fetchPokemon()` - Retrieves Pokemon with optional filtering and pagination.

Data contract expected by the card UI (PokemonSummary):
```json
{
  "id": 25,
  "name": "pikachu",
  "types": ["electric"],
  "sprites": { "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" }
}
```

Notes:
- `types` are lowercase strings. `sprites.front_default` may be null; the UI shows a placeholder image.
- `fetchPokemon` accepts `search`, `types` (comma-separated, AND semantics), `limit`, and `offset`.

## Setup & Installation

Prerequisites:

- Node.js (version 18 or higher)
- npm (Node Package Manager)
- Backend API running (see backend/README.md)

Local Development:

1. Clone the repo.
2. Navigate to the frontend directory.

    ```bash
    cd pokemon-project/frontend
    ```

3. Install the required dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm start
    ```

5. Open the browser and navigate to `http://localhost:3000`.

Using Docker:

The frontend can be run in a Docker container using the provided Dockerfile:

1. Build the Docker image:

    ```bash
    docker build -f Dockerfile.frontend.dev -t pokemon-frontend .
    ```

2. Run the Docker container:

    ```bash
    docker run -p 3000:3000 pokemon-frontend
    ```

Or use docker-compose from the project's root:

```bash
docker-compose up frontend
```

## Available Scripts

- `npm start` - Runs the app in development mode.
- `npm test` - Launches and runs the test runner.
- `npm run build` - Builds the app for production.
- `npm run eject` - Ejects from Create React App.
- `npm run storybook` - Starts the Storybook development server.
- `npm run build-storybook` - Builds the Storybook as a static web application.

## Storybook

Storybook provides an isolated environment for the development and testing of UI components:

```bash
npm run storybook
```

Or using the provided batch script from the project's root:

```bash
./run-storybook.bat
```

This opens Storybook in your browser at `http://localhost:6006`.

Included stories:
- PokemonCard/Default
- PokemonCard/MultipleTypes
- PokemonCard/MissingSprite
- PokemonCard/WithActions
- PokemonCard/InGrid

## Configuration

The frontend supports the following environment variables:

- **REACT_APP_API_BASE**: The base URL for the backend API (default: `http://localhost:8000`).

These can be configured in the `.env` file or set as environment variables.

## Testing

The project includes several types of tests:

- Unit Tests with React Testing Library (RTL): These tests cover individual components and functions to ensure they work as intended.
- Integration Tests with MSW (Mock Service Worker): These tests verify the interaction between different components and services by mocking API calls.
- Visual Regression Tests with Storybook: These tests capture and compare the visual appearance of components to detect unintended changes.

To run the tests, use the following command:

```bash
npm test
```

Guidance specific to the card UI and MSW:
- Queries: Prefer accessible queries like `getByRole('heading', { name: /pokemon type selector/i })`, `getAllByLabelText(/card$/i)`, `getByRole('img', { name: /pikachu sprite/i })`, and type-chip buttons by `aria-label` (e.g., `Filter by electric type`).
- Search input has `aria-label="Search"` to support `getByRole('textbox', { name: /search/i })`.
- MSW: Handlers use the v1 `rest` API and match any origin with `rest.get('*/pokemon', ...)` to intercept calls when `REACT_APP_API_BASE` varies.
- Loading state: Tests may need to await removal of “Loading…” before asserting cards.

MSW handler example used in tests:
```js
// src/test/msw/handlers.js
import { rest } from 'msw';

const makePokemon = (overrides = {}) => ({
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
  ...overrides,
});

export const handlers = [
  rest.get('*/pokemon', (req, res, ctx) => {
    const search = req.url.searchParams.get('search') || '';
    const typesCsv = req.url.searchParams.get('types') || '';
    const types = typesCsv ? typesCsv.split(',').filter(Boolean) : [];

    const data = [
      makePokemon(),
      makePokemon({ id: 1, name: 'bulbasaur', types: ['grass', 'poison'], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' } }),
      makePokemon({ id: 4, name: 'charmander', types: ['fire'], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' } }),
      makePokemon({ id: 7, name: 'squirtle', types: ['water'], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' } }),
      makePokemon({ id: 35, name: 'clefairy', types: ['fairy'], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png' } }),
    ];

    let results = data;
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(p => p.name.includes(s) || String(p.id) === s);
    }
    if (types.length > 0) {
      results = results.filter(p => types.every(t => p.types.includes(t)));
    }

    return res(ctx.json(results));
  }),
];
```

## Accessibility
- Each card is an `<article>` with `aria-label="{name} card"`.
- The card name is a link with `aria-label="View details for {Name} (#ID)"`.
- Sprite images have descriptive `alt` text; a placeholder is shown if the sprite is missing.
- Type chips are buttons with `aria-label="Filter by {type} type"`.
- Focus styles are visible on interactive elements (links and chips).

## UI States
- Loading: Skeleton cards render in a grid with `aria-busy="true"` on the grid container.
- Empty: A polite status message indicates no results.
- Error: An error message is displayed when requests fail.
