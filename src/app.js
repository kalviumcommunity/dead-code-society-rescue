require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Routes
const userRoutes = require('./routes/user.routes');
const shipmentRoutes = require('./routes/shipment.routes');

// Middlewares
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

(async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('--- DATABASE CONNECTED ---');
  } catch (err) {
    console.error('DATABASE CONNECTION ERROR:', err);
    process.exit(1);
  }
})();

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'LogiTrack Backend running' });
});

// Register routes
app.use('/auth', userRoutes);
app.use('/api/shipments', shipmentRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Wait for MongoDB before testing...');
});

module.exports = app;
