@echo off
echo ========================================
echo Building Pressia for Production
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found: 
node --version
echo.

echo Step 1: Installing dependencies...
npm install

echo.
echo Step 2: Building React app for production...
npm run build

echo.
echo Step 3: Building Windows executable...
npm run electron-pack

echo.
echo ========================================
echo Production build completed!
echo ========================================
echo.
echo Your executable is in the dist/ folder
echo This will run without:
echo - Web browser opening
echo - CMD window showing
echo - Development tools
echo.
echo Features:
echo - Clean desktop app only
echo - No console windows
echo - Professional installation
echo - Taskbar icon
echo.
pause 