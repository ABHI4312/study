// Quick test to verify routes can be loaded
const express = require('express');

console.log('Testing route loading...\n');

try {
  console.log('1. Testing SurpriseMessage model...');
  const SurpriseMessage = require('./models/SurpriseMessage');
  console.log('✅ SurpriseMessage model loaded successfully\n');

  console.log('2. Testing surpriseMessageController...');
  const controller = require('./controllers/surpriseMessageController');
  console.log('✅ Controller loaded successfully');
  console.log('   Available methods:', Object.keys(controller), '\n');

  console.log('3. Testing surpriseMessageRoutes...');
  const routes = require('./routes/surpriseMessageRoutes');
  console.log('✅ Routes loaded successfully\n');

  console.log('4. Testing route registration...');
  const app = express();
  app.use('/api/surprises', routes);
  console.log('✅ Routes registered successfully\n');

  console.log('🎉 All tests passed! Routes should work.\n');
  console.log('Next step: Restart your backend server with "npm run dev"');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('\nFull error:', error);
}
