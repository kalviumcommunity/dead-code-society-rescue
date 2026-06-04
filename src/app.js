require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// models are here
const User = require('./models/User'); // manually load models
const Shipment = require('./models/Shipment');

// routes
const routes = require('./routes');

const app = express();

// middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
const isLocalhost = mongoUrl.indexOf('localhost:27017') !== -1 || mongoUrl.indexOf('127.0.0.1:27017') !== -1;

function connectDb(url) {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        serverSelectionTimeoutMS: 1500
    });
}

async function initDb() {
    if (isLocalhost) {
        try {
            await connectDb(mongoUrl);
            console.log('--- DATABASE CONNECTED (Local MongoDB) ---');
        } catch (err) {
            console.log('Local MongoDB not running. Starting MongoMemoryServer...');
            try {
                const { MongoMemoryServer } = require('mongodb-memory-server');
                const mongoServer = await MongoMemoryServer.create();
                const inMemoryUri = mongoServer.getUri();
                await connectDb(inMemoryUri);
                console.log('--- DATABASE CONNECTED (MongoMemoryServer) --- ' + inMemoryUri);
            } catch (e) {
                console.log('DATABASE CONNECTION ERROR:');
                console.log(e);
            }
        }
    } else {
        try {
            await connectDb(mongoUrl);
            console.log('--- DATABASE CONNECTED ---');
        } catch (err) {
            console.log('DATABASE CONNECTION ERROR:');
            console.log(err);
        }
    }
}

initDb();

// register routes
app.use('/api', routes); // all routes under /api

// welcome route
app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

// no 404 handler here, let express handle it for now

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// exporting for testing later
module.exports = app;
