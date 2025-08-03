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
### Installation (I plan to have the application containerized with Docker in the future...)
1. Clone the repository:
   ```bash
   git clone https://github.com/JasonHunter95/pokemon-project.git
   ```
2. Navigate to the project directory:
   ```bash
   cd pokemon-project
   ```
3. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Install the frontend dependencies:
   ```bash
   npm install
   ```  