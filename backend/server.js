// server.js
// This is the MAIN file that starts our backend server
// Think of it as the front door of our application

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create the Express application
const app = express();

// MIDDLEWARE SETUP
// These run on every request before it reaches our routes

// Allow requests from our React frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Parse JSON data sent in request body
app.use(express.json());

// IMPORT ROUTES
// These files define what happens at each URL
const candidateRoutes = require('./routes/candidateRoutes');
const matchRoutes = require('./routes/matchRoutes');
const aiRoutes = require('./routes/aiRoutes');

// REGISTER ROUTES
// Tell Express which file handles which URL prefix
app.use('/api/candidates', candidateRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/ai', aiRoutes);

// HEALTH CHECK ROUTE
// Visit this URL to check if server is running
app.get('/', (req, res) => {
  res.json({ 
    message: 'Candidate Shortlisting API is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// ERROR HANDLER MIDDLEWARE
// This catches any errors that happen in routes
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// CONNECT TO MONGODB AND START SERVER
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
    // Start the server only after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 Visit: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Stop the server if DB fails
  });