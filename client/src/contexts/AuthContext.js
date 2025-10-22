import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get('/api/users/profile');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      await loadUser();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      await loadUser();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

