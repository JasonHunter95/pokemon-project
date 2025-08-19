# Pokémon Data Passion Project using Python and React (Pokémon API)

This project is a Pokémon-themed application built with Python for the backend and React for the frontend. It utilizes the Pokémon API (PokeAPI) to fetch data about various Pokémon, which is then displayed in a user-friendly interface. The project also incorporates Storybook for developing and testing UI components in isolation.

## Features

- Fetch and display Pokémon data using the Pokémon API (PokeAPI)
- User-friendly interface built with React
- Isolated component development and testing using Storybook
- Search by name or ID using the search bar.
- Search for abilities using the search bar.
- Search for moves using the search bar.
- Search for items using the search bar.
- Filter by type using the type buttons (up to two types maximum)
- Filter by stats using a set of sliders that contain min and max values indicative of the range of Pokémon stats.
- Combo filters for type and stats
- Card-based results grid (image, name, ID, and type chips)
- Inline actions on cards: type chip refines filters; card/name links to details (stub link until routing)
- Clear loading (skeletons), empty, and error states
- Accessibility: labeled controls, descriptive alt text, and visible focus indicators

## Button Components

### Type Buttons

These buttons represent the different Pokémon types (e.g., Fire, Water, Grass) and can be toggled on or off. Up to two buttons may be active at a time.
This allows users to filter Pokémon by type. There are only type combinations of two types, so the buttons are designed to handle this limitation.
In the event that a user tries to select a third type, the first selected type will be deselected automatically.
If a user selects only one type, all Pokémon of that type will be displayed, including Pokémon with that type as a secondary type.

### Active Button State

When a button is active, it will have a distinct style to indicate that it is selected. The active state can be toggled by clicking the button again.

### Button Styles

The buttons are styled to be visually appealing and consistent with the Pokémon theme. They change appearance when active or inactive, providing clear feedback to the user.

### Card Components

- Pokémon cards display a sprite, ID, name, and clickable type chips in a responsive grid.
- Missing sprites are handled with a placeholder image.
- Cards and names link to “/pokemon/:id” (stub until routing is added).

## Getting Started

### Prerequisites

- Python 3.x
- Node.js and npm
- React
- Docker Desktop (for the Docker-based workflow)

### Installation

### You'll need Docker Desktop installed to run the project

1. Ensure you have Docker Desktop installed and running.
2. Clone the repository:

```bash
   git clone https://github.com/JasonHunter95/pokemon-project.git
```

## ⚙️ Environment Configuration

Before running the project, you need to set up your local environment variables.

1.  **Create a `.env` file:** Copy the example template to a new file named `.env` in the root of the project.

    ```bash
    cp .env.example .env
    ```

2.  Navigate to the project directory:

```bash
   cd pokemon-project
```

3. Build and run the Docker containers:

```bash
   docker-compose up --build
```

4. Open your web browser and navigate to `http://localhost:3000` to view the frontend.

5. The backend will be accessible at `http://localhost:8000`.

### Running the Project

- To run the frontend and backend together, use:

```bash
  docker-compose up
```

- To run the frontend only, use:

```bash
  docker-compose up frontend
```

- To run the backend only, use:

```bash
  docker-compose up backend
```

### Stopping the Project

- To stop the running containers, use:

```bash
   docker-compose down
```

- To remove all unused images and containers, you can run:

```bash
  docker system prune -a
```

### Running Storybook

- To run Storybook for isolated component development, run:

  ```bash
  npm run storybook
  ```

### Running Tests

- Frontend unit/integration tests with RTL and MSW:

```bash
cd frontend
npm test
```

### Configuration

- Frontend: `REACT_APP_API_BASE` (default: `http://localhost:8000`)
- Backend: see backend README for environment variables

## Documentation Links

- Frontend details: `frontend/README.frontend.md`
- Backend details: `backend/README.backend.md`
