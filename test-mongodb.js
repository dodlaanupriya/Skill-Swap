// MongoDB Connection Test Script
// Run this with: node test-mongodb.js

const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    const testDoc = new TestModel({ name: 'Connection Test' });
    await testDoc.save();
    
    console.log('✅ Test document created successfully!');
    
    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('🧹 Test document cleaned up');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if MongoDB is running (for local installation)');
    console.log('2. Verify your connection string in .env file');
    console.log('3. Check network access settings (for Atlas)');
    console.log('4. Ensure username/password are correct');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

testConnection();





