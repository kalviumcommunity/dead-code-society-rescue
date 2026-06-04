require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const apiRoutes = require('./routes');

// Import middlewares
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => {
    console.log('--- DATABASE CONNECTED ---');
  })
  .catch((err) => {
    console.log('DATABASE CONNECTION ERROR:');
    console.log(err);
  });

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'LogiTrack Backend running' });
});

// API routes
app.use('/api', apiRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Centralized error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Waiting for MongoDB connection before testing...');
});

module.exports = app;

