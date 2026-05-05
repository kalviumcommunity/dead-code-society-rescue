// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
require('dotenv').config();
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var express = require('express');
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var mongoose = require('mongoose');
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var bodyParser = require('body-parser');
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var cors = require('cors');
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var path = require('path');

// models are here
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var User = require('../models/User'); // manually load models
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var Shipment = require('../models/Shipment');

// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var routes = require('./routes');

// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var app = express();

// middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
// SMELL: [MEDIUM] Promise chain with function syntax instead of async/await. Should use async/await for clarity.
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

// SMELL: [HIGH] No centralized error handler. No 404 handler. Errors will not be caught uniformly.
// no 404 handler here, let express handle it for now

// start server
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var PORT = process.env.PORT || 3000;
// SMELL: [MEDIUM] Using function syntax instead of async/await. Should use async/await for consistency.
app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// exporting for testing later
module.exports = app;
