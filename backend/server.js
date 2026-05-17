const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS - Allow all origins for now (you can restrict later)
app.use(
  cors({
    origin: true, // This allows all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600, // Cache preflight for 10 minutes
  })
);

// Additional CORS headers as fallback
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Connect to database (async, non-blocking)
connectDB();

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

