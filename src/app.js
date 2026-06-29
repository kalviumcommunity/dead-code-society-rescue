require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    console.error('DATABASE CONNECTION ERROR:', err);
});

// Register routes
app.use('/api', routes);

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'LogiTrack Backend running' });
});

// Centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
