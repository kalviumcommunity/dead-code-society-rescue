require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// const bodyParser = require('body-parser');
// const path = require('path');
// const User = require('../models/User');
// const Shipment = require('../models/Shipment');

const routes = require('./routes');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

mongoose.connect(mongoUrl)
    .then(() => {
        console.log('--- DATABASE CONNECTED ---');
    })
    .catch((err) => {
        console.log('DATABASE CONNECTION ERROR:');
        console.log(err);
    });

// routes
app.use('/api', routes);

// root route
app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
});

module.exports = app;