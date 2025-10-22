@echo off
echo ========================================
echo SkillSwap Quick Setup
echo ========================================
echo.

echo Setting up environment files...

REM Create .env file in server directory
cd server
echo PORT=5000 > .env
echo NODE_ENV=development >> .env
echo MONGODB_URI=mongodb://localhost:27017/skillswap >> .env
echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345 >> .env
echo CORS_ORIGIN=http://localhost:3000 >> .env

echo ✅ Environment file created

cd ..

echo.
echo ========================================
echo MongoDB Setup Required
echo ========================================
echo.
echo Your application needs a MongoDB database to work properly.
echo.
echo EASIEST OPTION - MongoDB Atlas (Free Cloud Database):
echo 1. Go to: https://www.mongodb.com/cloud/atlas
echo 2. Click "Try Free" and create an account
echo 3. Create a FREE cluster
echo 4. Get your connection string
echo 5. Update server/.env file with your connection string
echo.
echo ALTERNATIVE - Local MongoDB:
echo 1. Download from: https://www.mongodb.com/try/download/community
echo 2. Install and start the service
echo.
echo ========================================
echo.
echo After setting up MongoDB, run:
echo npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo ========================================
pause
