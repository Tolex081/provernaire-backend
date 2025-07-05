// backend/src/app.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // CORRECTED: Removed './src/'
const authRoutes = require('./routes/authRoutes'); // CORRECTED: Removed './src/'
const scoreRoutes = require('./routes/scoreRoutes'); // CORRECTED: Removed './src/'
const questionRoutes = require('./routes/questionRoutes'); // CORRECTED: Removed './src/'
const teamRoutes = require('./routes/teamRoutes'); // CORRECTED: Removed './src/'
const gameRoutes = require('./routes/gameRoutes'); // CORRECTED: Removed './src/'

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust in production for specific origins)
app.use(express.json()); // Body parser for JSON data
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data

// API Routes
// All routes will be prefixed with /api
app.use('/api/auth', authRoutes); // Authentication routes (register/login)
app.use('/api/scores', scoreRoutes); // Score routes (for leaderboard data)
app.use('/api/questions', questionRoutes); // Question routes (add/get questions)
app.use('/api/teams', teamRoutes); // Register the new team routes
app.use('/api/game', gameRoutes); // Register the new game routes

// Basic route for testing server status
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Define the port for the server
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export app for testing or serverless functions
