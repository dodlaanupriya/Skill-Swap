@echo off
echo ========================================
echo SkillSwap Firebase Setup Helper
echo ========================================
echo.
echo This script will help you set up Firebase for your SkillSwap application.
echo.
echo STEP 1: Create Firebase Project
echo 1. Go to https://console.firebase.google.com/
echo 2. Click "Create a project" or "Add project"
echo 3. Enter project name: skillswap-app
echo 4. Enable Google Analytics (optional)
echo 5. Click "Create project"
echo.
echo STEP 2: Enable Firestore Database
echo 1. In your Firebase project, go to "Firestore Database"
echo 2. Click "Create database"
echo 3. Choose "Start in test mode"
echo 4. Select a location close to your users
echo 5. Click "Done"
echo.
echo STEP 3: Enable Authentication
echo 1. Go to "Authentication" in the left menu
echo 2. Click "Get started"
echo 3. Go to "Sign-in method" tab
echo 4. Enable "Email/Password" provider
echo 5. Click "Save"
echo.
echo STEP 4: Get Service Account Key
echo 1. Go to "Project Settings" (gear icon)
echo 2. Go to "Service accounts" tab
echo 3. Click "Generate new private key"
echo 4. Download the JSON file
echo 5. Keep this file secure - never commit it to version control
echo.
echo STEP 5: Configure Environment Variables
echo Create server/.env file with your Firebase credentials:
echo.
echo PORT=5000
echo NODE_ENV=development
echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
echo FIREBASE_PROJECT_ID=your-project-id
echo FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
echo FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
echo.
echo STEP 6: Install Dependencies and Test
echo Run these commands:
echo   cd server
echo   npm install
echo   npm run dev
echo.
echo Then test registration at http://localhost:3000
echo.
echo For detailed instructions, see FIREBASE_SETUP.md
echo.
pause








