# SkillSwap - Peer Learning Platform 🎓

A modern platform where users can offer to teach skills and request skills they want to learn. The system intelligently matches users with complementary skills for peer-to-peer learning experiences.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication
- 👤 **Profile Management** - Complete user profiles with skills and bio
- 📝 **Skill Posting** - Post skills you can teach or want to learn
- 🔗 **Smart Matching** - Algorithm matches users with complementary skills
- 💬 **Messaging System** - Built-in chat for connecting with matches
- 📊 **Dashboard** - Overview of your learning journey and activity
- 🎨 **Modern UI** - Beautiful, responsive interface with Material-UI

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - Modern React with hooks
- **Material-UI (MUI)** - Component library
- **Axios** - HTTP client
- **React Router** - Navigation
- **Context API** - State management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- Git

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd skillswap
```

2. **Run the setup script:**
```bash
# For Windows
setup.bat

# For macOS/Linux
chmod +x setup.sh
./setup.sh
```

3. **Configure environment:**
```bash
# Copy the example environment file
cp server/env.example server/.env

# Edit server/.env with your configuration
# At minimum, change the JWT_SECRET
```

4. **Start the application:**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend client on `http://localhost:3000`

## 📁 Project Structure

```
skillswap/
├── server/                 # Backend API
│   ├── index.js           # Main server file
│   ├── package.json       # Server dependencies
│   └── env.example       # Environment configuration template
├── client/                # React frontend
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── App.js        # Main app component
│   │   └── index.js      # App entry point
│   └── package.json      # Client dependencies
├── package.json          # Root package.json
├── setup.sh             # Setup script (macOS/Linux)
├── setup.bat            # Setup script (Windows)
└── README.md            # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### Skills
- `POST /api/skills` - Post a new skill (teach/learn)
- `GET /api/skills` - Get all skills
- `GET /api/skills/user/:userId` - Get skills by user

### Matching
- `GET /api/matches` - Get matched users

### Messaging
- `POST /api/messages` - Send a message
- `GET /api/messages` - Get user's messages

## 🎯 How It Works

1. **Registration & Profile Setup**
   - Users create accounts with email/password
   - Complete profiles with skills they can teach and want to learn
   - Add bio and contact information

2. **Skill Matching**
   - System finds users who want to learn what you can teach
   - System finds users who can teach what you want to learn
   - Displays matches with relevant skill information

3. **Learning Exchange**
   - Users can message their matches
   - Direct contact information sharing
   - Skill-specific conversations

4. **Dashboard & Management**
   - Overview of skills, matches, and messages
   - Easy skill posting and editing
   - Profile management

## 🔧 Configuration

### Environment Variables

Create `server/.env` with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### Database Setup

The application uses MongoDB. Make sure MongoDB is running:
```bash
# Start MongoDB (varies by installation)
mongod

# Or use MongoDB Atlas cloud service
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB (local or cloud)
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify environment configuration
4. Check network connectivity

## 🎓 Learning Resources

- [React Documentation](https://reactjs.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

**Happy Learning! 🎓✨**
