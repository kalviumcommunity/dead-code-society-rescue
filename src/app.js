require('dotenv').config();
// SMELL: [MEDIUM] Using var instead of const/let throughout the file
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
// SMELL: [LOW] Unused import: path
var path = require('path');

// models are here
// SMELL: [MEDIUM] Manually loading models instead of using a centralized model loader
var User = require('../models/User'); // manually load models
var Shipment = require('../models/Shipment');

// routes
var routes = require('./routes');

var app = express();

// middleware setup
// SMELL: [MEDIUM] Using deprecated bodyParser instead of express.json()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
// SMELL: [HIGH] Deprecated Mongoose connection options (useNewUrlParser, useUnifiedTopology, etc.)
var mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
// SMELL: [HIGH] No proper error handling - app continues even if DB connection fails
.then(function() {
    console.log('--- DATABASE CONNECTED ---');
})
.catch(function(err) {
    console.log('DATABASE CONNECTION ERROR:');
    console.log(err);
});

// register routes
app.use('/api', routes); // all routes under /api

// welcome route
app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

// SMELL: [MEDIUM] No 404 handler - clients won't get proper error responses for unknown routes
// no 404 handler here, let express handle it for now

// start server
// SMELL: [MEDIUM] Server starts even if DB connection fails
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// SMELL: [LOW] No global error handling middleware registered
// exporting for testing later
module.exports = app;
