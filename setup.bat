@echo off
REM SkillSwap Setup Script for Windows
echo 🚀 Setting up SkillSwap - Peer Learning Platform
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
npm install
cd ..

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
npm install
cd ..

echo.
echo 🎉 Setup complete!
echo.
echo To start the application:
echo 1. Make sure MongoDB is running
echo 2. Run: npm run dev
echo.
echo This will start:
echo - Backend server on http://localhost:5000
echo - Frontend client on http://localhost:3000
echo.
echo 📝 Don't forget to:
echo - Update the JWT_SECRET in server/.env (or create the file)
echo - Configure MongoDB connection if needed
echo.
echo Happy learning! 🎓
pause

