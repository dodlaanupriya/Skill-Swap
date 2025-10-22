import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    contact: '',
    skillsToTeach: [],
    skillsToLearn: []
  });
  const [newSkillToTeach, setNewSkillToTeach] = useState('');
  const [newSkillToLearn, setNewSkillToLearn] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        contact: user.contact || '',
        skillsToTeach: user.skillsToTeach || [],
        skillsToLearn: user.skillsToLearn || []
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.put('/api/users/profile', formData);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Error updating profile: ' + (err.response?.data?.msg || err.message));
    }
    setLoading(false);
  };

  const addSkillToTeach = () => {
    if (newSkillToTeach.trim() && !formData.skillsToTeach.includes(newSkillToTeach.trim())) {
      setFormData({
        ...formData,
        skillsToTeach: [...formData.skillsToTeach, newSkillToTeach.trim()]
      });
      setNewSkillToTeach('');
    }
  };

  const addSkillToLearn = () => {
    if (newSkillToLearn.trim() && !formData.skillsToLearn.includes(newSkillToLearn.trim())) {
      setFormData({
        ...formData,
        skillsToLearn: [...formData.skillsToLearn, newSkillToLearn.trim()]
      });
      setNewSkillToLearn('');
    }
  };

  const removeSkillToTeach = (skill) => {
    setFormData({
      ...formData,
      skillsToTeach: formData.skillsToTeach.filter(s => s !== skill)
    });
  };

  const removeSkillToLearn = (skill) => {
    setFormData({
      ...formData,
      skillsToLearn: formData.skillsToLearn.filter(s => s !== skill)
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Profile Management
      </Typography>
      
      {message && (
        <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                disabled
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Tell others about yourself..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Information"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Phone, social media, or preferred contact method"
              />
            </Grid>

            {/* Skills to Teach */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Skills I Can Teach
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Add a skill you can teach"
                value={newSkillToTeach}
                onChange={(e) => setNewSkillToTeach(e.target.value)}
                placeholder="e.g., JavaScript, Cooking, Guitar"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addSkillToTeach}
                disabled={!newSkillToTeach.trim()}
              >
                Add Skill
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.skillsToTeach.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => removeSkillToTeach(skill)}
                    deleteIcon={<DeleteIcon />}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            {/* Skills to Learn */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Skills I Want to Learn
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Add a skill you want to learn"
                value={newSkillToLearn}
                onChange={(e) => setNewSkillToLearn(e.target.value)}
                placeholder="e.g., Python, Photography, Spanish"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addSkillToLearn}
                disabled={!newSkillToLearn.trim()}
              >
                Add Skill
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.skillsToLearn.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => removeSkillToLearn(skill)}
                    deleteIcon={<DeleteIcon />}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            {/* Save Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;

