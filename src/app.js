require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
// SMELL: [MEDIUM] body-parser is deprecated as a separate dependency. Use built-in express.json() and express.urlencoded() instead.
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');

// models are here
var User = require('../models/User'); // manually load models
var Shipment = require('../models/Shipment');

// routes
var routes = require('./routes');

var app = express();

// middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
// SMELL: [HIGH] Must use environment variable for MongoDB connection string. Hardcoded connection string can lead to security issues and makes it difficult to change the database configuration without modifying code.
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
});

// register routes
app.use('/api', routes); // all routes under /api

// welcome route
app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

// no 404 handler here, let express handle it for now

// start server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// exporting for testing later
module.exports = app;
