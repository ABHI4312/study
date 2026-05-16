const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Routes
app.use('/api/memories', require('./routes/memoryRoutes'));
app.use('/api/openwhen', require('./routes/openWhenRoutes'));
app.use('/api/secrets', require('./routes/secretMessageRoutes'));
app.use('/api/goals', require('./routes/futureGoalRoutes'));
app.use('/api/counter', require('./routes/counterRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/surprises', require('./routes/surpriseMessageRoutes'));
app.use('/api/music', require('./routes/musicSettingsRoutes'));
app.use('/api/deezer', require('./routes/deezerProxyRoutes'));

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: '❤️ Welcome to Our Little Universe API',
    status: 'running',
  });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`💫 Environment: ${process.env.NODE_ENV}`);
});

