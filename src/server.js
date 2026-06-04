const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

app.get('/api/status', function(req, res) {
    res.json({
        status: 'ok',
        service: 'LogiTrack',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/ping', function(req, res) {
    res.json({ pong: 'active' });
});

app.use('/api', apiRoutes);

app.use(errorHandler);

module.exports = app;