require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

mongoose
    .connect(mongoUrl, {
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

app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

app.get('/api/status', function(req, res) {
    res.json({ status: 'ok', service: 'LogiTrack API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);

app.use(function(req, res) {
    res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

module.exports = app;
