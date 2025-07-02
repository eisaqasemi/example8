const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testLogin() {
  try {
    console.log('Testing login endpoint...\n');

    // Test 1: Successful login
    console.log('1. Testing successful login with john@example.com...');
    const loginResponse = await axios.post(`${BASE_URL}/api/login`, {
      email: 'john@example.com',
      password: 'password'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', loginResponse.data.user.name);
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('');

    // Test 2: Failed login - wrong password
    console.log('2. Testing failed login with wrong password...');
    try {
      await axios.post(`${BASE_URL}/api/login`, {
        email: 'john@example.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      console.log('✅ Expected error:', error.response.data.message);
    }
    console.log('');

    // Test 3: Failed login - non-existent user
    console.log('3. Testing failed login with non-existent user...');
    try {
      await axios.post(`${BASE_URL}/api/login`, {
        email: 'nonexistent@example.com',
        password: 'password'
      });
    } catch (error) {
      console.log('✅ Expected error:', error.response.data.message);
    }
    console.log('');

    // Test 4: Register new user
    console.log('4. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/api/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      age: 25
    });
    
    console.log('✅ Registration successful!');
    console.log('New user:', registerResponse.data.user.name);
    console.log('Token:', registerResponse.data.token.substring(0, 20) + '...');
    console.log('');

    // Test 5: Login with newly registered user
    console.log('5. Testing login with newly registered user...');
    const newLoginResponse = await axios.post(`${BASE_URL}/api/login`, {
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    console.log('✅ Login with new user successful!');
    console.log('User:', newLoginResponse.data.user.name);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testLogin(); 