/**
 * @file server.js
 * @description Application entry point. Configures Express and connects to MongoDB.
 */

// Load environment variables early
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import utilities and custom error classes
const { NotFoundError } = require('./utils/errors.util');

// Validate critical environment variables
if (!process.env.JWT_SECRET) {
  console.warn('❌ FATAL: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

/**
 * Standard Middlewares
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Routes setup
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shipments', shipmentRoutes);

/**
 * 404 handler for unknown routes
 */
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

/**
 * Global Error Handling Middleware - Must be the last app.use()
 */
app.use(errorHandler);

/**
 * Database Connection and Server Startup
 */
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/logitrack';
const PORT = process.env.PORT || 5000;

console.log('Connecting to database...');

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('✅ MongoDB connection successful.');
    app.listen(PORT, () => {
      console.log(`🚀 LogiTrack Production API running on port ${PORT}`);
      console.log(`📡 Deployment Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Handle unhandled rejections outside Express
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;
