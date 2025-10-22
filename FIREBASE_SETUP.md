# Firebase Setup Guide for SkillSwap

## Overview
Your SkillSwap application has been migrated from MongoDB to Firebase Firestore. This guide will help you set up Firebase and configure your application.

## Step 1: Create Firebase Project

### 1.1 Create Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `skillswap-app` (or your preferred name)
4. Enable Google Analytics (optional for development)
5. Click "Create project"

### 1.2 Configure Project
1. Wait for project creation to complete
2. Click "Continue" when ready

## Step 2: Enable Firestore Database

### 2.1 Create Database
1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users (e.g., us-central1)
5. Click "Done"

### 2.2 Configure Security Rules (Optional)
For development, the default rules are fine. For production, you'll want to restrict access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 3: Enable Authentication

### 3.1 Set Up Authentication
1. Go to "Authentication" in the left menu
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 4: Get Firebase Configuration

### 4.1 Get Web App Config
1. Go to "Project Settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web (</>) icon
4. Register your app with nickname: `skillswap-web`
5. Copy the configuration object

### 4.2 Get Service Account Key (for Server)
1. Go to "Project Settings" > "Service accounts" tab
2. Click "Generate new private key"
3. Download the JSON file
4. Keep this file secure - never commit it to version control

## Step 5: Configure Environment Variables

### 5.1 Server Configuration
Create `server/.env` file with your Firebase credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Alternative method using service account key:**
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
```

### 5.2 Client Configuration
Create `client/.env` file with your Firebase web config:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## Step 6: Install Dependencies

### 6.1 Install Server Dependencies
```bash
cd server
npm install
```

### 6.2 Install Client Dependencies
```bash
cd client
npm install
```

## Step 7: Test Your Setup

### 7.1 Test Server Connection
```bash
cd server
node index.js
```
You should see:
```
🚀 Server running on port 5000
🔥 Firebase Firestore connected successfully!
```

### 7.2 Test Client Connection
```bash
cd client
npm start
```
Open http://localhost:3000 and try to register a new user.

## Step 8: Firebase Console Management

### 8.1 View Data
- Go to Firestore Database in Firebase Console
- You'll see collections: `users`, `skills`, `messages`
- Data will appear as you use the application

### 8.2 Monitor Usage
- Go to "Usage" tab to see database reads/writes
- Free tier includes generous limits for development

## Troubleshooting

### Common Issues:

1. **"Firebase initialization error"**
   - Check your environment variables
   - Verify service account key is correct
   - Ensure project ID matches

2. **"Permission denied"**
   - Check Firestore security rules
   - Verify authentication is working
   - Ensure user is logged in

3. **"Invalid API key"**
   - Verify client environment variables
   - Check Firebase project settings
   - Ensure API key is correct

### Quick Fix Commands:
```bash
# Install all dependencies
npm run install-all

# Start development server
npm run dev

# Check server logs
cd server && npm run dev

# Check client logs
cd client && npm start
```

## Production Considerations

### Security Rules
Update Firestore rules for production:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /skills/{skillId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.receiverId == request.auth.uid);
    }
  }
}
```

### Environment Variables
- Use proper secret management in production
- Never commit `.env` files
- Use Firebase App Check for additional security

## Next Steps

1. Complete Firebase project setup
2. Configure environment variables
3. Install dependencies
4. Test the application
5. Start developing your features!

Your SkillSwap application is now powered by Firebase Firestore! 🚀
