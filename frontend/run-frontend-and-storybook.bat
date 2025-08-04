@echo off
REM This script starts both the React frontend and Storybook servers for the Pokemon project.
REM Run this script from the root of your project directory.
echo Starting the Pokemon React frontend...
start "React Frontend" cmd /k "npm start"
echo Starting Storybook...
start "Storybook" cmd /k "npm run storybook"
echo Both servers are starting in separate windows.
