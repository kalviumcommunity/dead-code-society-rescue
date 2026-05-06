require('dotenv').config();

// SMELL: [MEDIUM] Using var causes function-scoped hoisting issues.
// Modern JavaScript should use const/let instead.
var express = require('express');

// SMELL: [MEDIUM] Using var instead of const throughout the app
// reduces code safety and readability.
var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');

// models are here

// SMELL: [HIGH] Models are manually loaded directly into app.js.
// app.js should only configure the server, not manage models.
var User = require('../models/User'); // manually load models

// SMELL: [HIGH] Tight coupling between app setup and models.
// Violates MVC separation of concerns.
var Shipment = require('../models/Shipment');

// routes

// SMELL: [HIGH] Entire application routes are handled in a single routes file.
// This creates a God File that becomes difficult to maintain.
var routes = require('./routes');

var app = express();

// middleware setup
app.use(cors());

// SMELL: [MEDIUM] body-parser is outdated because Express has built-in JSON parsing.
// express.json() should be used instead.
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// database connection

// SMELL: [MEDIUM] Hardcoded fallback database URL may accidentally connect
// to local databases in production environments.
var mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

    // SMELL: [MEDIUM] Deprecated Mongoose options are used.
    // Modern Mongoose versions no longer require these settings.
    useCreateIndex: true,

    useFindAndModify: false
})
.then(function() {

    // SMELL: [MEDIUM] Promise chains reduce readability in large applications.
    // async/await should be used for cleaner async handling.
    console.log('--- DATABASE CONNECTED ---');
})
.catch(function(err) {

    // SMELL: [HIGH] Raw database errors are logged directly.
    // This may expose sensitive internal details in production.
    console.log('DATABASE CONNECTION ERROR:');

    console.log(err);
});

// register routes

// SMELL: [HIGH] All routes are grouped under one routes file.
// Route modules should be separated by feature (auth, users, shipments).
app.use('/api', routes); // all routes under /api

// welcome route
app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

// SMELL: [MEDIUM] No centralized 404 handler exists.
// Unknown routes return inconsistent responses.

// no 404 handler here, let express handle it for now

// start server
var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {

    // SMELL: [MEDIUM] String concatenation is used instead of template literals.
    // Template literals improve readability.
    console.log('Server is alive on port ' + PORT);

    console.log('Wait for MongoDB before testing...');
});

// exporting for testing later
module.exports = app;