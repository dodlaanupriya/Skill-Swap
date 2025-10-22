# MongoDB Setup Guide for SkillSwap

## Current Status
Your SkillSwap application is ready to run, but it needs a MongoDB database connection. Here are your options:

## Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" and create an account
3. Choose the FREE tier (M0 Sandbox)

### Step 2: Create a Cluster
1. Choose "Build a Database"
2. Select "FREE" tier
3. Choose a cloud provider and region
4. Give your cluster a name (e.g., "skillswap-cluster")
5. Click "Create Cluster"

### Step 3: Set Up Database Access
1. Go to "Database Access" in the left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username: `skillswap`
5. Create password: `skillswap123`
6. Click "Add User"

### Step 4: Set Up Network Access
1. Go to "Network Access" in the left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters" and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your password

### Step 6: Update Your .env File
Update `server/.env` with your connection string:
```
MONGODB_URI=mongodb+srv://skillswap:skillswap123@your-cluster.mongodb.net/skillswap?retryWrites=true&w=majority
```

## Option 2: Local MongoDB Installation

### Windows Installation
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service
5. Start the MongoDB service

### Verify Installation
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB if not running
Start-Service MongoDB
```

## Option 3: Docker (If Docker Desktop is installed)

### Install Docker Desktop
1. Download from: https://www.docker.com/products/docker-desktop
2. Install and restart your computer
3. Run the setup script: `./setup-mongodb.bat`

### Manual Docker Commands
```bash
# Start MongoDB container
docker run -d -p 27017:27017 --name skillswap-mongodb mongo:latest

# Check if it's running
docker ps

# Stop MongoDB
docker stop skillswap-mongodb

# Start MongoDB again
docker start skillswap-mongodb
```

## Testing Your Setup

### 1. Test MongoDB Connection
```bash
cd server
node ../test-mongodb.js
```

### 2. Start Your Application
```bash
npm run dev
```

### 3. Test Registration
Open your browser and go to: http://localhost:3000
Try to register a new user.

## Troubleshooting

### Common Issues:

1. **"Cannot connect to MongoDB"**
   - Check if MongoDB is running
   - Verify connection string in .env file
   - Check network access (for Atlas)

2. **"Registration failed"**
   - Ensure MongoDB is connected
   - Check server logs for errors
   - Verify all dependencies are installed

3. **"Server error"**
   - Check MongoDB connection
   - Verify .env file exists and has correct values
   - Restart the server

### Quick Fix Commands:
```bash
# Install all dependencies
npm install
cd server && npm install

# Create .env file (if missing)
cd server
echo PORT=5000 > .env
echo NODE_ENV=development >> .env
echo MONGODB_URI=mongodb://localhost:27017/skillswap >> .env
echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345 >> .env
```

## Next Steps

1. Choose one of the MongoDB setup options above
2. Follow the steps for your chosen option
3. Test the connection
4. Start your application with `npm run dev`
5. Open http://localhost:3000 and test registration

Your application should now work without any errors!
