require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDb } = require('./config/db');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb(MONGO_URL)
    .then(function() {
        console.log('--- DATABASE CONNECTED ---');
    })
    .catch(function(err) {
        console.log('DATABASE CONNECTION ERROR:');
        console.log(err);
    });

app.use('/api', routes);

app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

module.exports = app;
