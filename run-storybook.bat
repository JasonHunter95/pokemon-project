@echo off
setlocal EnableExtensions

rem Run from repo root regardless of current directory
pushd "%~dp0frontend" || (
  echo Failed to cd into frontend
  exit /b 1
)

echo Installing dependencies...
call npm install || (
  echo npm install failed
  popd
  exit /b 1
)

echo Starting Storybook on http://localhost:6006 ...
rem Runs in the same terminal; Storybook will open the browser automatically
call npm run storybook

set "code=%errorlevel%"
popd
endlocal & exit /b %code%
