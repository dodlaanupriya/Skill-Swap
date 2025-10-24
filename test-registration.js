const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Registration failed!');
    console.log('Error:', error.response?.data || error.message);
    console.log('Status:', error.response?.status);
  }
}

testRegistration();








