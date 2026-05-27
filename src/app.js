require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// routes
const routes = require('./routes');

const app = express();

// middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
(async function connectDB() {
    try {
        await mongoose.connect(mongoUrl);
        console.log('--- DATABASE CONNECTED ---');
    } catch (err) {
        console.log('DATABASE CONNECTION ERROR:');
        console.log(err);
    }
})();

// register routes
app.use('/api', routes); // all routes under /api

// welcome route
app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

// 404 handler
app.use(function(req, res) {
    res.status(404).json({ error: 'Route not found' });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// exporting for testing later
module.exports = app;
