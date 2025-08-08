# Pokémon Project using Python and React (Pokémon API) using Storybook for UI components

This project is a Pokémon-themed application built with Python for the backend and React for the frontend. It utilizes the Pokémon API to fetch data about various Pokémon, which is then displayed in a user-friendly interface. The project also incorporates Storybook for developing and testing UI components in isolation.

## Features

- Fetch and display Pokémon data using the Pokémon API
- User-friendly interface built with React
- Isolated component development and testing using Storybook

## Button Components

### Type Buttons

These buttons represent the different Pokémon types (e.g., Fire, Water, Grass) and can be toggled on or off. Up to two buttons may be active at a time.
This allows users to filter Pokémon by type. There are only type combinations of two types, so the buttons are designed to handle this limitation.

### Active Button State

When a button is active, it will have a distinct style to indicate that it is selected. The active state can be toggled by clicking the button again.

### Button Styles

The buttons are styled to be visually appealing and consistent with the Pokémon theme. They change appearance when active or inactive, providing clear feedback to the user.

## Getting Started

### Prerequisites

- Python 3.x
- Node.js and npm
- React

### Installation

### You'll need Docker Desktop installed to run the project

1. Ensure you have Docker Desktop installed and running.
2. Clone the repository:

```bash
   git clone https://github.com/JasonHunter95/pokemon-project.git
```

3. Navigate to the project directory:

```bash
   cd pokemon-project
```

4. Build and run the Docker containers:

```bash
   docker-compose up --build
```

5. Open your web browser and navigate to `http://localhost:3000` to view the frontend.

6. The backend will be accessible at `http://localhost:8000`.

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

- To run Storybook for isolated component development, navigate to the `frontend` directory and run:

  ```bash
  npm run storybook
  ```

- You can also run Storybook using the provided batch script from the 'root':

  ```bash
  ./run-storybook.bat
  ```
