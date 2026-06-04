require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');

// models are here
// SMELL: [MEDIUM] These imports are never used, which makes the app module look more coupled than it really is.
// Dead imports also hide the actual dependencies that this file needs to boot.

var User = require('../models/User'); // manually load models
// SMELL: [MEDIUM] This model is imported but never referenced in app.js, so it adds noise without any runtime value.

var Shipment = require('../models/Shipment');

// routes
var routes = require('./routes');

var app = express();

// middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
// SMELL: [HIGH] The app reads DATABASE_URL without failing fast when it is missing, so startup can proceed into a broken connection state.
// Configuration errors should stop boot immediately instead of surfacing later as opaque runtime failures.

var mongoUrl = process.env.DATABASE_URL;
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
// SMELL: [HIGH] The server starts listening before confirming the database is usable, which can expose endpoints in a degraded state.
// Boot should gate request handling on a successful connection or health check.

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// exporting for testing later
module.exports = app;
