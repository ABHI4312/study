const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/art-diary';

// Test functions
const testGetAllArt = async () => {
  try {
    console.log('\n📚 Testing GET all art entries...');
    const response = await axios.get(API_URL);
    console.log('✅ Success!');
    console.log('Count:', response.data.count);
    console.log('Data:', JSON.stringify(response.data.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

const testGetFiltered = async () => {
  try {
    console.log('\n🔍 Testing GET with filters (favorites)...');
    const response = await axios.get(`${API_URL}?favorite=true`);
    console.log('✅ Success!');
    console.log('Favorites count:', response.data.count);
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

const testCreateArt = async (imagePath) => {
  try {
    console.log('\n📤 Testing POST (create art with image)...');
    
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      console.log('⚠️ Image file not found. Skipping upload test.');
      console.log('To test upload, provide a valid image path.');
      return null;
    }

    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    form.append('title', 'Test Artwork');
    form.append('description', 'This is a test artwork created via API');
    form.append('date', new Date().toISOString());
    form.append('artType', 'digital-art');
    form.append('tags', 'test, api, demo');
    form.append('isFavorite', 'true');

    const response = await axios.post(API_URL, form, {
      headers: form.getHeaders(),
    });
    
    console.log('✅ Success!');
    console.log('Created art:', JSON.stringify(response.data.data, null, 2));
    return response.data.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

const testGetSingleArt = async (id) => {
  try {
    console.log(`\n🔍 Testing GET single art (ID: ${id})...`);
    const response = await axios.get(`${API_URL}/${id}`);
    console.log('✅ Success!');
    console.log('Art details:', JSON.stringify(response.data.data, null, 2));
    return response.data.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

const testToggleFavorite = async (id) => {
  try {
    console.log(`\n❤️ Testing PATCH toggle favorite (ID: ${id})...`);
    const response = await axios.patch(`${API_URL}/${id}/favorite`);
    console.log('✅ Success!');
    console.log('Updated favorite status:', response.data.data.isFavorite);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

const testDeleteArt = async (id) => {
  try {
    console.log(`\n🗑️ Testing DELETE art (ID: ${id})...`);
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log('✅ Success!');
    console.log('Deleted successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

// Run all tests
const runTests = async () => {
  console.log('🎨 Art Diary API Test Suite');
  console.log('============================');
  console.log('Make sure your backend server is running on http://localhost:5000');
  console.log('');

  // Test 1: Get all art
  await testGetAllArt();

  // Test 2: Get filtered (favorites)
  await testGetFiltered();

  // Test 3: Create new art (skip if no image provided)
  const imagePath = process.argv[2]; // Get image path from command line
  let createdArt = null;
  if (imagePath) {
    createdArt = await testCreateArt(imagePath);
  } else {
    console.log('\n⚠️ No image path provided. Skipping create test.');
    console.log('To test creation, run: node testArtDiary.js path/to/image.jpg');
  }

  // Test 4: Get single art (if we created one)
  if (createdArt) {
    await testGetSingleArt(createdArt._id);

    // Test 5: Toggle favorite
    await testToggleFavorite(createdArt._id);

    // Test 6: Delete art (optional - uncomment to test)
    // await testDeleteArt(createdArt._id);
    console.log('\n💡 Note: Test art was NOT deleted. Delete manually or uncomment delete test.');
  }

  console.log('\n✅ All tests completed!');
};

// Run the tests
runTests().catch(console.error);
