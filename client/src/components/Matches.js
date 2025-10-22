import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Avatar,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Message as MessageIcon
} from '@mui/icons-material';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const res = await axios.get('/api/matches');
      setMatches(res.data);
    } catch (err) {
      setMessage('Error loading matches: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (match) => {
    try {
      // This would open a message dialog or navigate to messages
      setMessage(`Opening conversation with ${match.user.name}...`);
      // For now, we'll just show a success message
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error sending message: ' + err.message);
    }
  };

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
      <Typography variant="h4" gutterBottom>
        Your Matches
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Find your perfect learning partners based on complementary skills
      </Typography>

      {message && (
        <Alert severity={message.includes('Error') ? 'error' : 'info'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {matches.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No matches found yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Complete your profile with skills you can teach and want to learn to find matches!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {matches.map((match, index) => (
            <Grid item xs={12} sm={6} md={4} key={`${match.user._id}-${index}`}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {match.user.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h2">
                        {match.user.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {match.user.email}
                      </Typography>
                    </Box>
                  </Box>

                  {match.user.bio && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {match.user.bio}
                    </Typography>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={`${match.matchType === 'teach' ? 'I can teach' : 'I want to learn'}: ${match.skill}`}
                      color={match.matchType === 'teach' ? 'primary' : 'secondary'}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>

                  {match.user.skillsToTeach && match.user.skillsToTeach.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Can teach:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {match.user.skillsToTeach.slice(0, 3).map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                        {match.user.skillsToTeach.length > 3 && (
                          <Chip
                            label={`+${match.user.skillsToTeach.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {match.user.skillsToLearn && match.user.skillsToLearn.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Wants to learn:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {match.user.skillsToLearn.slice(0, 3).map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        ))}
                        {match.user.skillsToLearn.length > 3 && (
                          <Chip
                            label={`+${match.user.skillsToLearn.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {match.user.contact && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Contact:
                      </Typography>
                      <Typography variant="body2">
                        {match.user.contact}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<MessageIcon />}
                    onClick={() => handleSendMessage(match)}
                    sx={{ mb: 1 }}
                  >
                    Send Message
                  </Button>
                  {match.user.contact && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EmailIcon />}
                      href={`mailto:${match.user.email}`}
                    >
                      Contact Directly
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Matches;

