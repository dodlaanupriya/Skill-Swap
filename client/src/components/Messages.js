import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Send as SendIcon,
  Message as MessageIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    receiverId: '',
    content: '',
    skillId: ''
  });

  useEffect(() => {
    loadMessages();
    loadUsers();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await axios.get('/api/messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // In a real app, you'd have a users endpoint
      // For now, we'll get users from matches
      const res = await axios.get('/api/matches');
      const uniqueUsers = res.data.reduce((acc, match) => {
        if (!acc.find(u => u._id === match.user._id)) {
          acc.push(match.user);
        }
        return acc;
      }, []);
      setUsers(uniqueUsers);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.receiverId || !newMessage.content.trim()) {
      setMessage('Please select a recipient and enter a message');
      return;
    }

    try {
      await axios.post('/api/messages', newMessage);
      setNewMessage({
        receiverId: '',
        content: '',
        skillId: ''
      });
      setOpen(false);
      setMessage('Message sent successfully!');
      loadMessages();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error sending message: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
    setMessage('');
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setNewMessage({
      receiverId: '',
      content: '',
      skillId: ''
    });
  };

  // Group messages by conversation
  const conversations = messages.reduce((acc, msg) => {
    const otherUserId = msg.senderId._id === user._id ? msg.receiverId._id : msg.senderId._id;
    const otherUserName = msg.senderId._id === user._id ? msg.receiverId.name : msg.senderId.name;
    
    if (!acc[otherUserId]) {
      acc[otherUserId] = {
        user: { _id: otherUserId, name: otherUserName },
        messages: []
      };
    }
    acc[otherUserId].messages.push(msg);
    return acc;
  }, {});

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">
          Messages
        </Typography>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleOpenDialog}
        >
          New Message
        </Button>
      </Box>

      {message && (
        <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {Object.keys(conversations).length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <MessageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No messages yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Start a conversation with your matches to begin learning together!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {Object.values(conversations).map((conversation) => (
            <Grid item xs={12} md={6} key={conversation.user._id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {conversation.user.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Typography variant="h6">
                      {conversation.user.name}
                    </Typography>
                  </Box>
                  
                  <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {conversation.messages
                      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                      .map((msg, index) => (
                        <React.Fragment key={msg._id}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: msg.senderId._id === user._id ? 'primary.main' : 'secondary.main' }}>
                                {msg.senderId.name?.charAt(0) || 'U'}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={msg.content}
                              secondary={
                                <Box>
                                  <Typography variant="caption" color="textSecondary">
                                    {msg.senderId.name} • {new Date(msg.createdAt).toLocaleString()}
                                  </Typography>
                                  {msg.skillId && (
                                    <Typography variant="caption" display="block" color="primary">
                                      Re: {msg.skillId.title}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < conversation.messages.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* New Message Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Send New Message</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Send to</InputLabel>
              <Select
                value={newMessage.receiverId}
                onChange={(e) => setNewMessage({ ...newMessage, receiverId: e.target.value })}
                label="Send to"
              >
                {users.map((userOption) => (
                  <MenuItem key={userOption._id} value={userOption._id}>
                    {userOption.name} ({userOption.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={newMessage.content}
              onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
              placeholder="Type your message here..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={!newMessage.receiverId || !newMessage.content.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Messages;

