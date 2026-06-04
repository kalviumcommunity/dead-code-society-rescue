require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');

// models are here
var User = require('./models/User'); // manually load models
var Shipment = require('./models/Shipment');

// routes
var routes = require('./routes');

var app = express();

// middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
var mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
var isLocalhost = mongoUrl.indexOf('localhost:27017') !== -1 || mongoUrl.indexOf('127.0.0.1:27017') !== -1;

function connectDb(url) {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        serverSelectionTimeoutMS: 1500
    });
}

if (isLocalhost) {
    connectDb(mongoUrl)
        .then(function() {
            console.log('--- DATABASE CONNECTED (Local MongoDB) ---');
        })
        .catch(function(err) {
            console.log('Local MongoDB not running. Starting MongoMemoryServer...');
            var MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
            MongoMemoryServer.create()
                .then(function(mongoServer) {
                    var inMemoryUri = mongoServer.getUri();
                    return connectDb(inMemoryUri)
                        .then(function() {
                            console.log('--- DATABASE CONNECTED (MongoMemoryServer) --- ' + inMemoryUri);
                        });
                })
                .catch(function(e) {
                    console.log('DATABASE CONNECTION ERROR:');
                    console.log(e);
                });
        });
} else {
    connectDb(mongoUrl)
        .then(function() {
            console.log('--- DATABASE CONNECTED ---');
        })
        .catch(function(err) {
            console.log('DATABASE CONNECTION ERROR:');
            console.log(err);
        });
}

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
