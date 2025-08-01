@echo off
echo Starting Pressia Laundry Management...
echo.

REM Start React development server in background
start /B npm start

REM Wait for React server to be ready
timeout /t 5 /nobreak >nul

REM Start Electron app
npx electron .

echo.
echo App started! Close this window when done.
pause 