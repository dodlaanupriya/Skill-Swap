// Test script to verify SkillSwap setup
const axios = require('axios');

async function testSetup() {
  console.log('🧪 Testing SkillSwap Setup...\n');
  
  // Test 1: Check if server is running
  console.log('1️⃣ Testing server connection...');
  try {
    const response = await axios.get('http://localhost:5000/api/auth/register', {
      timeout: 5000,
      validateStatus: () => true // Accept any status code
    });
    console.log('✅ Server is running on port 5000');
  } catch (error) {
    console.log('❌ Server is not running or not accessible');
    console.log('💡 Start the server with: npm run dev');
    return;
  }
  
  // Test 2: Test registration endpoint
  console.log('\n2️⃣ Testing registration endpoint...');
  try {
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testUser, {
      timeout: 10000,
      validateStatus: () => true
    });
    
    if (response.status === 200) {
      console.log('✅ Registration endpoint working - user created successfully');
    } else if (response.status === 400 && response.data.msg === 'User already exists') {
      console.log('✅ Registration endpoint working - user already exists (expected)');
    } else {
      console.log('⚠️  Registration endpoint responded with:', response.status, response.data);
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Cannot connect to server');
    } else {
      console.log('❌ Registration test failed:', error.message);
    }
  }
  
  // Test 3: Test skills endpoint
  console.log('\n3️⃣ Testing skills endpoint...');
  try {
    const response = await axios.get('http://localhost:5000/api/skills', {
      timeout: 5000,
      validateStatus: () => true
    });
    
    if (response.status === 200) {
      console.log('✅ Skills endpoint working');
    } else {
      console.log('⚠️  Skills endpoint responded with:', response.status);
    }
  } catch (error) {
    console.log('❌ Skills endpoint test failed:', error.message);
  }
  
  console.log('\n🎉 Setup test completed!');
  console.log('\n📋 Next steps:');
  console.log('1. If you see errors, check MongoDB connection');
  console.log('2. Follow the MONGODB_SETUP.md guide');
  console.log('3. Open http://localhost:3000 to test the frontend');
}

// Run the test
testSetup().catch(console.error);



