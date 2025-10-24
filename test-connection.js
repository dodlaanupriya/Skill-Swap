// Test MongoDB Connection
// Run this with: node test-connection.js

const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📍 Connection string:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@'));
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    
    // Test basic operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.length);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Check:');
    console.log('1. MongoDB is running (local) or Atlas cluster is active');
    console.log('2. Connection string in server/.env is correct');
    console.log('3. Network access is allowed (Atlas)');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

testConnection();


















