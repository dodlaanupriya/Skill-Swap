import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Skills from './components/Skills';
import Matches from './components/Matches';
import Messages from './components/Messages';

function AppContent() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleLogout = () => {
    logout();
  };

  const handleNavigateToMessages = (user) => {
    setSelectedUser(user);
    setCurrentPage('messages');
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SkillSwap
          </Typography>
          <Button color="inherit" onClick={() => setCurrentPage('dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => setCurrentPage('profile')}>
            Profile
          </Button>
          <Button color="inherit" onClick={() => setCurrentPage('skills')}>
            Skills
          </Button>
          <Button color="inherit" onClick={() => setCurrentPage('matches')}>
            Matches
          </Button>
          <Button color="inherit" onClick={() => setCurrentPage('messages')}>
            Messages
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'profile' && <Profile />}
        {currentPage === 'skills' && <Skills />}
        {currentPage === 'matches' && <Matches onSendMessage={handleNavigateToMessages} />}
        {currentPage === 'messages' && <Messages selectedUser={selectedUser} onBackToMatches={() => setCurrentPage('matches')} />}
      </Container>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

