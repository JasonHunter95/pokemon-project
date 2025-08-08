@echo off
REM This script starts both the React frontend and Storybook servers for the Pokemon project.
REM Run this script from the root of your project directory.
cd frontend
start "Installing Dependencies for local Storybook development." cmd /k "npm install"
echo Starting Storybook...
start "Storybook" cmd /k "npm run storybook"
echo Storybook is now running in the browser at http://localhost:6006
