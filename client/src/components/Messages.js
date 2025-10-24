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
  Person as PersonIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const Messages = ({ selectedUser, onBackToMatches }) => {
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
  const [currentConversation, setCurrentConversation] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedConversationUser, setSelectedConversationUser] = useState(null);

  useEffect(() => {
    if (user) {
      loadMessages();
      loadUsers();
    }
  }, [user]);

  // Group messages by conversation
  const conversations = messages.reduce((acc, msg) => {
    const otherUserId = msg.senderId.id === user?.id ? msg.receiverId.id : msg.senderId.id;
    const otherUserName = msg.senderId.id === user?.id ? msg.receiverId.name : msg.senderId.name;
    
    if (!acc[otherUserId]) {
      acc[otherUserId] = {
        user: { id: otherUserId, name: otherUserName },
        messages: []
      };
    }
    acc[otherUserId].messages.push(msg);
    return acc;
  }, {});

  useEffect(() => {
    const userToShow = selectedUser || selectedConversationUser;
    if (userToShow) {
      // Find conversation with selected user
      const conversation = conversations[userToShow.id];
      if (conversation) {
        setCurrentConversation(conversation);
      } else {
        // Create a new conversation object for the selected user
        setCurrentConversation({
          user: userToShow,
          messages: []
        });
      }
    }
  }, [selectedUser, selectedConversationUser, messages, conversations]);

  const loadMessages = async () => {
    if (!user) {
      setMessage('Please log in to view messages');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('/api/messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Error loading messages:', err);
      if (err.response?.status === 401) {
        setMessage('Authentication failed. Please log in again.');
      } else {
        setMessage('Error loading messages: ' + (err.response?.data?.msg || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    if (!user) {
      return;
    }

    try {
      // In a real app, you'd have a users endpoint
      // For now, we'll get users from matches
      const res = await axios.get('/api/matches');
      const uniqueUsers = res.data.reduce((acc, match) => {
        if (!acc.find(u => u.id === match.user.id)) {
          acc.push(match.user);
        }
        return acc;
      }, []);
      setUsers(uniqueUsers);
    } catch (err) {
      console.error('Error loading users:', err);
      if (err.response?.status === 401) {
        setMessage('Authentication failed. Please log in again.');
      } else {
        setMessage('Error loading users: ' + (err.response?.data?.msg || err.message));
      }
    }
  };

  const handleSendMessage = async () => {
    if (!user) {
      setMessage('Please log in to send messages');
      return;
    }

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
      if (err.response?.status === 401) {
        setMessage('Authentication failed. Please log in again.');
      } else {
        setMessage('Error sending message: ' + (err.response?.data?.msg || err.message));
      }
    }
  };

  const handleSendMessageToCurrentUser = async (content) => {
    if (!user) {
      setMessage('Please log in to send messages');
      return;
    }

    const userToMessage = selectedUser || selectedConversationUser;
    if (!userToMessage || !content.trim()) {
      setMessage('Please enter a message');
      return;
    }

    try {
      await axios.post('/api/messages', {
        receiverId: userToMessage.id,
        content: content.trim(),
        skillId: ''
      });
      setMessage('Message sent successfully!');
      loadMessages();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage('Authentication failed. Please log in again.');
      } else {
        setMessage('Error sending message: ' + (err.response?.data?.msg || err.message));
      }
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversationUser(conversation.user);
  };

  const handleBackToMessages = () => {
    setSelectedConversationUser(null);
    setCurrentConversation(null);
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


  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6">Please log in to view messages</Typography>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // If we have a selected user (from Matches or Messages page), show the chat interface
  if ((selectedUser || selectedConversationUser) && currentConversation) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
          {selectedUser && onBackToMatches ? (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBackToMatches}
              sx={{ mr: 2 }}
            >
              Back to Matches
            </Button>
          ) : (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToMessages}
              sx={{ mr: 2 }}
            >
              Back to Messages
            </Button>
          )}
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {(selectedUser || selectedConversationUser)?.name?.charAt(0) || 'U'}
          </Avatar>
          <Typography variant="h4">
            Chat with {(selectedUser || selectedConversationUser)?.name}
          </Typography>
        </Box>

        {message && (
          <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Card sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
            {currentConversation.messages.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <MessageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No messages yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Start the conversation with {(selectedUser || selectedConversationUser)?.name}!
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 2 }}>
                {currentConversation.messages
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((msg, index) => (
                    <React.Fragment key={msg.id}>
                      <ListItem sx={{ justifyContent: msg.senderId.id === user.id ? 'flex-end' : 'flex-start' }}>
                        <Box sx={{ maxWidth: '70%' }}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: msg.senderId.id === user.id ? 'primary.main' : 'grey.100',
                              color: msg.senderId.id === user.id ? 'white' : 'text.primary'
                            }}
                          >
                            <Typography variant="body1">{msg.content}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                              {new Date(msg.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    </React.Fragment>
                  ))}
              </List>
            )}
          </CardContent>
          
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessageToCurrentUser(currentMessage);
                    setCurrentMessage('');
                  }
                }}
                multiline
                maxRows={3}
              />
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={() => {
                  handleSendMessageToCurrentUser(currentMessage);
                  setCurrentMessage('');
                }}
                disabled={!currentMessage.trim()}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    );
  }

  // Default messages list view
  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">
          Messages
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              setLoading(true);
              loadMessages();
              loadUsers();
            }}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleOpenDialog}
          >
            New Message
          </Button>
        </Box>
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
            <Grid item xs={12} md={6} key={conversation.user.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
                onClick={() => handleConversationClick(conversation)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {conversation.user.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">
                        {conversation.user.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Click to open conversation
                      </Typography>
                    </Box>
                  </Box>
                  
                  {conversation.messages.length > 0 ? (
                    <Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Latest message:
                      </Typography>
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'grey.200'
                      }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {conversation.messages
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].content}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(conversation.messages
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                        {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''} total
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                      No messages yet - click to start the conversation!
                    </Typography>
                  )}
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
                  <MenuItem key={userOption.id} value={userOption.id}>
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

