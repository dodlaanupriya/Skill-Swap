const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // Option 1: Using service account key file
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID
        });
      }
      // Option 2: Using individual environment variables
      else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
          })
        });
      }
      // Option 3: Using default credentials (for production with proper IAM)
      else {
        console.log('⚠️  Firebase environment variables not found. Using default initialization.');
        console.log('📝 To fix this, create a .env file in the server directory with:');
        console.log('   FIREBASE_PROJECT_ID=your-project-id');
        console.log('   FIREBASE_CLIENT_EMAIL=your-client-email');
        console.log('   FIREBASE_PRIVATE_KEY="your-private-key"');
        console.log('   Or follow the FIREBASE_SETUP.md guide');
        
        // For now, initialize with a mock configuration to prevent crashes
        admin.initializeApp({
          projectId: 'skillswap-demo'
        });
      }
      
      console.log('✅ Firebase Admin SDK initialized successfully!');
      console.log('📊 Project ID:', process.env.FIREBASE_PROJECT_ID || 'skillswap-demo');
    }
    
    return admin.firestore();
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.log('\n🔧 Firebase Setup Options:');
    console.log('1. Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
    console.log('2. Set individual Firebase environment variables');
    console.log('3. Use Firebase service account key file');
    console.log('4. Configure Firebase project settings');
    console.log('5. Follow the FIREBASE_SETUP.md guide for detailed instructions');
    
    // Don't throw error, let the server start anyway for testing
    console.log('\n⚠️  Server will start without Firebase connection for testing purposes');
    return null;
  }
};

// Initialize Firestore
const db = initializeFirebase();

module.exports = { admin, db };
