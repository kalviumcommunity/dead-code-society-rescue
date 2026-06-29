require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// models are here
const User = require('./models/user.model');
const Shipment = require('./models/shipment.model');

// routes
const routes = require('./routes/index');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connection logic with automatic in-memory fallback
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

async function connectDb() {
    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('--- DATABASE CONNECTED ---');
    } catch (err) {
        console.log('Could not connect to configured DATABASE_URL: ' + mongoUrl);
        console.log('Starting local in-memory MongoDB server as fallback...');
        
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            console.log('In-memory MongoDB server running at: ' + uri);
            
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });
            console.log('--- FALLBACK DATABASE CONNECTED (IN-MEMORY) ---');
        } catch (fallbackErr) {
            console.log('FALLBACK DATABASE CONNECTION ERROR:');
            console.log(fallbackErr);
        }
    }
}

connectDb();

// register routes
app.use('/api', routes); // all routes under /api

// welcome route
app.get('/', (req, res) => {
    res.json({ message: 'LogiTrack Backend running' });
});

// Centralized error handler
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// exporting for testing later
module.exports = app;
