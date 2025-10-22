import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Message as MessageIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    skillsToTeach: 0,
    skillsToLearn: 0,
    matches: 0,
    messages: 0
  });
  const [recentSkills, setRecentSkills] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load user's skills
      const skillsRes = await axios.get(`/api/skills/user/${user._id}`);
      const skills = skillsRes.data;
      
      // Load matches
      const matchesRes = await axios.get('/api/matches');
      const matches = matchesRes.data;
      
      // Load messages
      const messagesRes = await axios.get('/api/messages');
      const messages = messagesRes.data;

      setStats({
        skillsToTeach: user.skillsToTeach?.length || 0,
        skillsToLearn: user.skillsToLearn?.length || 0,
        matches: matches.length,
        messages: messages.length
      });

      setRecentSkills(skills.slice(0, 3));
      setRecentMatches(matches.slice(0, 3));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
          </Box>
          <Box color={color} fontSize="large">
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Here's what's happening with your learning journey
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Skills I Teach"
            value={stats.skillsToTeach}
            icon={<SchoolIcon fontSize="large" />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Skills I Learn"
            value={stats.skillsToLearn}
            icon={<PersonIcon fontSize="large" />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Matches"
            value={stats.matches}
            icon={<PeopleIcon fontSize="large" />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Messages"
            value={stats.messages}
            icon={<MessageIcon fontSize="large" />}
            color="info.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Skills */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              My Skills
            </Typography>
            <List>
              {recentSkills.map((skill, index) => (
                <React.Fragment key={skill._id}>
                  <ListItem>
                    <ListItemText
                      primary={skill.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {skill.description}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={skill.type}
                              size="small"
                              color={skill.type === 'teach' ? 'primary' : 'secondary'}
                            />
                            <Chip
                              label={skill.category}
                              size="small"
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentSkills.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            {recentSkills.length === 0 && (
              <Typography color="textSecondary" align="center">
                No skills posted yet. Add some skills to get started!
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Recent Matches */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Matches
            </Typography>
            <List>
              {recentMatches.map((match, index) => (
                <React.Fragment key={match.user._id}>
                  <ListItem>
                    <ListItemText
                      primary={match.user.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {match.user.email}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={`${match.matchType} ${match.skill}`}
                              size="small"
                              color={match.matchType === 'teach' ? 'primary' : 'secondary'}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentMatches.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            {recentMatches.length === 0 && (
              <Typography color="textSecondary" align="center">
                No matches yet. Complete your profile to find learning partners!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

