# SkillSwap Configuration Guide

## Environment Setup

1. Create a file named `.env` in the `server/` directory
2. Add the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
NODE_ENV=development
```

## If using MongoDB Atlas (Cloud):
Replace the MONGODB_URI with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillswap
```

## Running the Application

After installing Node.js and setting up the environment:

1. Start MongoDB (if using local installation)
2. Run: `npm run dev`
3. Open browser to: http://localhost:3000

## Troubleshooting

- Make sure MongoDB is running
- Check that all dependencies are installed
- Verify the .env file is in the server directory
- Ensure ports 3000 and 5000 are available

