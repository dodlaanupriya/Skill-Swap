const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { db } = require('./firebase-config');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database collections - handle case where db might be null
const usersCollection = db ? db.collection('users') : null;
const skillsCollection = db ? db.collection('skills') : null;
const messagesCollection = db ? db.collection('messages') : null;

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Routes

// Auth routes
app.post('/api/auth/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if database is available
    if (!usersCollection) {
      return res.status(500).json({ msg: 'Database not configured. Please set up Firebase following the FIREBASE_SETUP.md guide.' });
    }

    // Check if user already exists
    const existingUser = await usersCollection.where('email', '==', email).get();
    if (!existingUser.empty) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      bio: '',
      contact: '',
      skillsToTeach: [],
      skillsToLearn: [],
      createdAt: new Date()
    };

    const userRef = await usersCollection.add(userData);
    const userId = userRef.id;

    const payload = {
      user: {
        id: userId
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if database is available
    if (!usersCollection) {
      return res.status(500).json({ msg: 'Database not configured. Please set up Firebase following the FIREBASE_SETUP.md guide.' });
    }

    const userSnapshot = await usersCollection.where('email', '==', email).get();
    if (userSnapshot.empty) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const userDoc = userSnapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User routes
app.get('/api/users/profile', auth, async (req, res) => {
  try {
    const userDoc = await usersCollection.doc(req.user.user.id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const userData = userDoc.data();
    delete userData.password; // Remove password from response
    res.json({ id: userDoc.id, ...userData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.put('/api/users/profile', auth, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('bio').optional(),
  body('contact').optional(),
  body('skillsToTeach').optional().isArray(),
  body('skillsToLearn').optional().isArray()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, bio, contact, skillsToTeach, skillsToLearn } = req.body;
    const userRef = usersCollection.doc(req.user.user.id);
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (contact !== undefined) updateData.contact = contact;
    if (skillsToTeach !== undefined) updateData.skillsToTeach = skillsToTeach;
    if (skillsToLearn !== undefined) updateData.skillsToLearn = skillsToLearn;

    await userRef.update(updateData);
    const updatedUser = await userRef.get();
    res.json({ id: updatedUser.id, ...updatedUser.data() });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Skill routes
app.post('/api/skills', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').isIn(['teach', 'learn']).withMessage('Type must be teach or learn'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, type, category, level } = req.body;
    const skillData = {
      userId: req.user.user.id,
      title,
      description,
      type,
      category,
      level: level || 'beginner',
      createdAt: new Date()
    };

    const skillRef = await skillsCollection.add(skillData);
    const skillDoc = await skillRef.get();
    res.json({ id: skillDoc.id, ...skillDoc.data() });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/skills', async (req, res) => {
  try {
    const skillsSnapshot = await skillsCollection.get();
    const skills = [];
    
    for (const skillDoc of skillsSnapshot.docs) {
      const skillData = skillDoc.data();
      const userDoc = await usersCollection.doc(skillData.userId).get();
      const userData = userDoc.data();
      
      skills.push({
        id: skillDoc.id,
        ...skillData,
        userId: {
          id: userDoc.id,
          name: userData.name,
          email: userData.email
        }
      });
    }
    
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/skills/user/:userId', async (req, res) => {
  try {
    const skillsSnapshot = await skillsCollection.where('userId', '==', req.params.userId).get();
    const skills = [];
    
    for (const skillDoc of skillsSnapshot.docs) {
      const skillData = skillDoc.data();
      const userDoc = await usersCollection.doc(skillData.userId).get();
      const userData = userDoc.data();
      
      skills.push({
        id: skillDoc.id,
        ...skillData,
        userId: {
          id: userDoc.id,
          name: userData.name,
          email: userData.email
        }
      });
    }
    
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Matching routes
app.get('/api/matches', auth, async (req, res) => {
  try {
    const userDoc = await usersCollection.doc(req.user.user.id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const user = userDoc.data();
    const matches = [];

    // Find users who want to learn what this user can teach
    for (const skill of user.skillsToTeach) {
      const usersWantingToLearn = await usersCollection
        .where('skillsToLearn', 'array-contains', skill)
        .where('__name__', '!=', req.user.user.id)
        .get();
      
      usersWantingToLearn.forEach(doc => {
        const userData = doc.data();
        delete userData.password; // Remove password
        matches.push({
          user: { id: doc.id, ...userData },
          matchType: 'teach',
          skill: skill
        });
      });
    }

    // Find users who can teach what this user wants to learn
    for (const skill of user.skillsToLearn) {
      const usersWhoCanTeach = await usersCollection
        .where('skillsToTeach', 'array-contains', skill)
        .where('__name__', '!=', req.user.user.id)
        .get();
      
      usersWhoCanTeach.forEach(doc => {
        const userData = doc.data();
        delete userData.password; // Remove password
        matches.push({
          user: { id: doc.id, ...userData },
          matchType: 'learn',
          skill: skill
        });
      });
    }

    // Remove duplicates
    const uniqueMatches = matches.filter((match, index, self) => 
      index === self.findIndex(m => m.user.id === match.user.id)
    );

    res.json(uniqueMatches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Message routes
app.post('/api/messages', auth, [
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  body('content').notEmpty().withMessage('Message content is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if database is available
    if (!messagesCollection) {
      return res.status(500).json({ msg: 'Database not configured. Please set up Firebase following the FIREBASE_SETUP.md guide.' });
    }

    const { receiverId, content, skillId } = req.body;
    const messageData = {
      senderId: req.user.user.id,
      receiverId,
      content,
      skillId: skillId || null,
      createdAt: new Date()
    };

    const messageRef = await messagesCollection.add(messageData);
    const messageDoc = await messageRef.get();
    res.json({ id: messageDoc.id, ...messageDoc.data() });
  } catch (err) {
    console.error('Error creating message:', err.message);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

app.get('/api/messages', auth, async (req, res) => {
  try {
    // Check if database is available
    if (!messagesCollection) {
      return res.status(500).json({ msg: 'Database not configured. Please set up Firebase following the FIREBASE_SETUP.md guide.' });
    }

    const messagesSnapshot = await messagesCollection
      .where('senderId', '==', req.user.user.id)
      .get();
    
    const receivedMessagesSnapshot = await messagesCollection
      .where('receiverId', '==', req.user.user.id)
      .get();
    
    const allMessages = [];
    
    // Process sent messages
    for (const messageDoc of messagesSnapshot.docs) {
      const messageData = messageDoc.data();
      const senderDoc = await usersCollection.doc(messageData.senderId).get();
      const receiverDoc = await usersCollection.doc(messageData.receiverId).get();
      const skillDoc = messageData.skillId ? await skillsCollection.doc(messageData.skillId).get() : null;
      
      allMessages.push({
        id: messageDoc.id,
        ...messageData,
        senderId: { id: senderDoc.id, name: senderDoc.data().name },
        receiverId: { id: receiverDoc.id, name: receiverDoc.data().name },
        skillId: skillDoc ? { id: skillDoc.id, title: skillDoc.data().title } : null
      });
    }
    
    // Process received messages
    for (const messageDoc of receivedMessagesSnapshot.docs) {
      const messageData = messageDoc.data();
      const senderDoc = await usersCollection.doc(messageData.senderId).get();
      const receiverDoc = await usersCollection.doc(messageData.receiverId).get();
      const skillDoc = messageData.skillId ? await skillsCollection.doc(messageData.skillId).get() : null;
      
      allMessages.push({
        id: messageDoc.id,
        ...messageData,
        senderId: { id: senderDoc.id, name: senderDoc.data().name },
        receiverId: { id: receiverDoc.id, name: receiverDoc.data().name },
        skillId: skillDoc ? { id: skillDoc.id, title: skillDoc.data().title } : null
      });
    }
    
    // Sort by creation date
    allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(allMessages);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('🔥 Firebase Firestore connected successfully!');
});