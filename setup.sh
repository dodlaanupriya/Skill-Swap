#!/bin/bash

# SkillSwap Setup Script
echo "🚀 Setting up SkillSwap - Peer Learning Platform"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Please install MongoDB."
    echo "Visit: https://www.mongodb.com/try/download/community"
    echo "Make sure MongoDB is running before starting the application."
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Make sure MongoDB is running"
echo "2. Run: npm run dev"
echo ""
echo "This will start:"
echo "- Backend server on http://localhost:5000"
echo "- Frontend client on http://localhost:3000"
echo ""
echo "📝 Don't forget to:"
echo "- Update the JWT_SECRET in server/.env (or create the file)"
echo "- Configure MongoDB connection if needed"
echo ""
echo "Happy learning! 🎓"

