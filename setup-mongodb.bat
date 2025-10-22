@echo off
echo ========================================
echo SkillSwap MongoDB Setup Script
echo ========================================
echo.

echo Checking if Docker is installed...
docker --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Docker is installed
    echo.
    echo Starting MongoDB with Docker...
    docker run -d -p 27017:27017 --name skillswap-mongodb mongo:latest
    if %errorlevel% == 0 (
        echo ✅ MongoDB started successfully with Docker!
        echo 📊 MongoDB is running on: mongodb://localhost:27017/skillswap
        echo.
        echo You can now run your application with: npm run dev
    ) else (
        echo ❌ Failed to start MongoDB with Docker
        echo Trying to start existing container...
        docker start skillswap-mongodb
    )
) else (
    echo ❌ Docker is not installed
    echo.
    echo Please choose one of these options:
    echo 1. Install Docker Desktop: https://www.docker.com/products/docker-desktop
    echo 2. Install MongoDB locally: https://www.mongodb.com/try/download/community
    echo 3. Use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas
    echo.
    echo After installing, run this script again.
)

echo.
echo ========================================
pause



