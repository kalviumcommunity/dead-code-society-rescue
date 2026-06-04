require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// models are here
const User = require('./models/User'); // manually load models
const Shipment = require('./models/Shipment');

// routes
const routes = require('./routes/index');

const app = express();

// middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
// SMELL: [MEDIUM] Deprecated mongoose configuration options (useNewUrlParser, useUnifiedTopology, useCreateIndex, useFindAndModify) are used.
const connectDB = async () => {
    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('--- DATABASE CONNECTED ---');
    } catch (err) {
        console.log('DATABASE CONNECTION ERROR:');
        console.log(err);
    }
};
connectDB();

// register routes
app.use('/api', routes); // all routes under /api

// welcome route
app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

// SMELL: [HIGH] Lack of global 404 handler and error handling middleware leaves exceptions unhandled or returned as HTML instead of JSON.
// no 404 handler here, let express handle it for now

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// exporting for testing later
module.exports = app;
