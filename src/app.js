require('dotenv').config();
// SMELL: [MEDIUM]
// Using 'var' instead of 'const' or 'let'. var has function scope and can cause bugs.
// Replace all 'var' with 'const' for immutable references and block scope.
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// models are here
// SMELL: [MEDIUM]
// Models are manually required here but never used in app.js.
// Unused imports should be removed. Models are loaded in routes.js.
const User = require('../models/User'); // manually load models
const Shipment = require('../models/Shipment');

// routes
const routes = require('./routes');

const app = express();

// middleware setup
app.use(cors());
// SMELL: [MEDIUM]
// body-parser is deprecated in Express 4.16.0+. Use express.json() and express.urlencoded().
// Replace bodyParser.json() with express.json().
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
// SMELL: [MEDIUM]
// useCreateIndex, useFindAndModify are deprecated in mongoose 6.0+.
// Remove these deprecated options to avoid deprecation warnings.
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(function() {
    console.log('--- DATABASE CONNECTED ---');
})
.catch(function(err) {
    console.log('DATABASE CONNECTION ERROR:');
    console.log(err);
    // SMELL: [HIGH]
    // Database connection failure is not handled. Application continues running.
    // Should either exit process (process.exit(1)) or wait for reconnection.
    // This causes all requests to fail with unclear database errors.
});

// register routes
app.use('/api', routes); // all routes under /api

// welcome route
app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

// SMELL: [MEDIUM]
// Missing 404 error handler. Undefined routes return generic HTML error.
// Should implement middleware to handle 404s and return consistent JSON response.
// no 404 handler here, let express handle it for now

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// SMELL: [MEDIUM]
// Exporting app for testing is good, but should also handle graceful shutdown.
// Add signal handlers for SIGTERM/SIGINT to close connections before exit.
// exporting for testing later
module.exports = app;
