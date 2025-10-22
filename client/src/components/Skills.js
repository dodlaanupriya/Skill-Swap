import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'teach',
    category: '',
    level: 'beginner'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Technology', 'Languages', 'Arts & Crafts', 'Music', 'Sports & Fitness',
    'Cooking', 'Business', 'Science', 'Math', 'Writing', 'Photography',
    'Design', 'Other'
  ];

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await axios.get('/api/skills');
      setSkills(res.data);
    } catch (err) {
      console.error('Error loading skills:', err);
    }
  };

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
      if (editingSkill) {
        await axios.put(`/api/skills/${editingSkill._id}`, formData);
        setMessage('Skill updated successfully!');
      } else {
        await axios.post('/api/skills', formData);
        setMessage('Skill posted successfully!');
      }
      
      setFormData({
        title: '',
        description: '',
        type: 'teach',
        category: '',
        level: 'beginner'
      });
      setOpen(false);
      setEditingSkill(null);
      loadSkills();
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.msg || err.message));
    }
    setLoading(false);
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      title: skill.title,
      description: skill.description,
      type: skill.type,
      category: skill.category,
      level: skill.level
    });
    setOpen(true);
  };

  const handleDelete = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await axios.delete(`/api/skills/${skillId}`);
        setMessage('Skill deleted successfully!');
        loadSkills();
      } catch (err) {
        setMessage('Error deleting skill: ' + (err.response?.data?.msg || err.message));
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSkill(null);
    setFormData({
      title: '',
      description: '',
      type: 'teach',
      category: '',
      level: 'beginner'
    });
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">
          Skills Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Post New Skill
        </Button>
      </Box>

      {message && (
        <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Skills Grid */}
      <Grid container spacing={3}>
        {skills.map((skill) => (
          <Grid item xs={12} sm={6} md={4} key={skill._id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {skill.title}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(skill)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(skill._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {skill.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={skill.type}
                    color={skill.type === 'teach' ? 'primary' : 'secondary'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={skill.category}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={skill.level}
                    variant="outlined"
                    size="small"
                  />
                </Box>
                
                <Typography variant="caption" color="textSecondary">
                  Posted by: {skill.userId?.name || 'Unknown'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {skills.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No skills posted yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Be the first to post a skill and start connecting with learners!
          </Typography>
        </Paper>
      )}

      {/* Add/Edit Skill Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSkill ? 'Edit Skill' : 'Post New Skill'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Skill Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              required
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Type"
              >
                <MenuItem value="teach">I can teach this</MenuItem>
                <MenuItem value="learn">I want to learn this</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                name="level"
                value={formData.level}
                onChange={handleChange}
                label="Level"
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : (editingSkill ? 'Update' : 'Post')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Skills;

