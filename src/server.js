require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const shipmentRoutes = require('./routes/shipment.routes');

// Middlewares
const errorHandler = require('./middlewares/error.middleware');
const notFound = require('./middlewares/notFound.middleware');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('--- DATABASE CONNECTED ---');
  })
  .catch((err) => {
    console.log('DATABASE CONNECTION ERROR:');
    console.log(err);
  });

// Register routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/shipments', shipmentRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'LogiTrack Backend running' });
});

// Health check route
app.get('/ping', (req, res) => {
  res.json({ pong: 'active' });
});

// 404 handler - must be before error handler
app.use(notFound);

// Error handler - must be last
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is alive on port ${PORT}`);
  console.log('Wait for MongoDB before testing...');
});

module.exports = app;
