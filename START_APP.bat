@echo off
echo ========================================
echo Pressia Laundry Management
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Download the LTS version and install it.
    echo.
    pause
    exit /b 1
)

echo Starting Pressia Laundry Management...
echo.

REM Start the React development server
start /B npm start

REM Wait for the server to start
timeout /t 10 /nobreak >nul

REM Start Electron using npx
npx electron .

echo.
echo App closed. Press any key to exit...
pause 