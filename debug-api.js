// Test script to debug API issues
const api = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with same config as frontend
const testApi = api.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

async function testAPI() {
  try {
    console.log('Testing API with baseURL:', API_BASE_URL);
    
    // Test the exact request that's failing
    console.log('\n1. Testing blog post endpoint...');
    const response = await testApi.get('/blogs/posts/essential-air-travel-guidelines-for-a-safe-and-comfortable-journey');
    console.log('✅ Success! Response status:', response.status);
    console.log('✅ Data keys:', Object.keys(response.data));
    console.log('✅ Author:', response.data.data?.post?.author);
    
  } catch (error) {
    console.error('❌ API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAPI();