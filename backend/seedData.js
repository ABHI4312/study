const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import models
const Memory = require('./models/Memory');
const OpenWhen = require('./models/OpenWhen');
const SecretMessage = require('./models/SecretMessage');
const FutureGoal = require('./models/FutureGoal');
const Auth = require('./models/Auth');
const Counter = require('./models/Counter');
const SurpriseMessage = require('./models/SurpriseMessage');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✨ MongoDB Connected');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const sampleMemories = [
  {
    title: 'Our First Date',
    description: 'The day we met at the coffee shop and talked for hours. I knew you were special from the moment I saw your smile.',
    date: new Date('2024-01-15'),
    category: 'first-time',
    isFavorite: true,
    tags: ['love', 'first', 'coffee', 'special'],
    author: 'me',
  },
  {
    title: 'First Kiss',
    description: 'Under the stars, you leaned in and everything felt perfect. Time stopped and it was just us.',
    date: new Date('2024-02-14'),
    category: 'special-moment',
    isFavorite: true,
    tags: ['kiss', 'romantic', 'stars'],
    author: 'me',
  },
  {
    title: 'Beach Adventure',
    description: 'We spent the whole day at the beach, building sandcastles and watching the sunset together.',
    date: new Date('2024-03-20'),
    category: 'adventure',
    tags: ['beach', 'sunset', 'fun'],
    author: 'you',
  },
];

const sampleOpenWhens = [
  {
    title: 'Open When You\'re Sad',
    message: 'My love, whenever you feel sad, remember that you are my sunshine. Your smile lights up my world, and I\'m always here for you. Close your eyes and feel my hug. Everything will be okay. I love you more than words can say. ❤️',
    condition: 'you\'re feeling sad',
    emoji: '😢',
  },
  {
    title: 'Open When You Miss Me',
    message: 'I miss you too, my darling. Distance means nothing when someone means everything. Close your eyes and remember our last hug, our last kiss, our last laugh. I\'m counting down the moments until I can hold you again. You\'re always in my heart. 💕',
    condition: 'you miss me',
    emoji: '💕',
  },
  {
    title: 'Open When You Need Motivation',
    message: 'You are stronger than you think, braver than you believe, and more capable than you imagine. I believe in you with all my heart. You\'ve got this! Remember, I\'m your biggest cheerleader. Go conquer the world, my love! 💪✨',
    condition: 'you need motivation',
    emoji: '💪',
  },
  {
    title: 'Open When You\'re Happy',
    message: 'Your happiness is my happiness! I love seeing you smile and hearing your laugh. Keep shining bright, my star. You deserve all the joy in the world. Let\'s celebrate this beautiful moment together! 🎉😊',
    condition: 'you\'re happy',
    emoji: '😊',
  },
  {
    title: 'Open When You Can\'t Sleep',
    message: 'Close your eyes, my love. Imagine we\'re together, lying under the stars. Feel my arms around you, keeping you safe and warm. Count the stars, count our memories, and drift into sweet dreams. Good night, my everything. 🌙✨',
    condition: 'you can\'t sleep',
    emoji: '🌙',
  },
];

const sampleSecrets = [
  {
    title: 'My Heart\'s Deepest Secret',
    message: 'You are my everything, my love, my life, my universe. Every moment with you is a treasure I hold close to my heart. I love you more than words can express, more than the stars in the sky, more than all the grains of sand on every beach. You make my world complete. Forever yours. ❤️💫',
  },
];

const sampleGoals = [
  {
    title: 'Visit Paris Together',
    description: 'Romantic trip to the city of love, see the Eiffel Tower, walk along the Seine',
    targetDate: new Date('2027-06-15'),
    category: 'travel',
  },
  {
    title: 'Learn to Cook Together',
    description: 'Take a cooking class and master our favorite dishes',
    targetDate: new Date('2026-12-31'),
    category: 'together',
  },
  {
    title: 'Watch 100 Sunsets',
    description: 'Experience 100 beautiful sunsets together',
    category: 'together',
  },
  {
    title: 'Create a Photo Album',
    description: 'Compile all our favorite memories into a beautiful album',
    targetDate: new Date('2026-12-25'),
    category: 'personal',
  },
];

const sampleSurprises = [
  {
    title: 'A Little Reminder',
    message: 'Hey beautiful! Just wanted to remind you how amazing you are. You make every day brighter just by being you. I\'m so lucky to have you in my life. Keep being awesome! 💖✨',
    author: 'me',
    emoji: '💖',
    isOpened: false,
  },
  {
    title: 'Thank You',
    message: 'Thank you for always being there for me, for your patience, your kindness, and your love. You\'re my rock, my safe place, my home. I appreciate you more than you know. 🏡❤️',
    author: 'you',
    emoji: '💝',
    isOpened: false,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Memory.deleteMany({});
    await OpenWhen.deleteMany({});
    await SecretMessage.deleteMany({});
    await FutureGoal.deleteMany({});
    await Counter.deleteMany({});
    await SurpriseMessage.deleteMany({});

    // Insert sample data
    console.log('📝 Inserting sample memories...');
    await Memory.insertMany(sampleMemories);

    console.log('💌 Inserting Open When letters...');
    await OpenWhen.insertMany(sampleOpenWhens);

    console.log('🔐 Inserting secret message...');
    await SecretMessage.insertMany(sampleSecrets);

    console.log('🎯 Inserting future goals...');
    await FutureGoal.insertMany(sampleGoals);

    console.log('🎁 Inserting surprise messages...');
    await SurpriseMessage.insertMany(sampleSurprises);

    console.log('💕 Creating love counter...');
    await Counter.create({ name: 'love-counter', count: 0 });

    // Setup secret code (optional - uncomment to set)
    // console.log('🔐 Setting up secret code...');
    // await Auth.deleteMany({});
    // await Auth.create({ secretCode: 'OurSecret123' });

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${sampleMemories.length} memories`);
    console.log(`   - ${sampleOpenWhens.length} Open When letters`);
    console.log(`   - ${sampleSecrets.length} secret message`);
    console.log(`   - ${sampleGoals.length} future goals`);
    console.log(`   - ${sampleSurprises.length} surprise messages`);
    console.log(`   - 1 love counter`);
    console.log('\n🎉 Your database is ready!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
