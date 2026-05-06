require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

/**
 * Connects to MongoDB using environment configuration.
 * @returns {Promise<typeof import('mongoose')>} Mongoose connection promise.
 */
const connectDatabase = async () => {
  const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
  return mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'LogiTrack Backend running' });
});

app.use('/api', apiRoutes);

app.use((req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

module.exports = {
  app,
  connectDatabase,
};
