const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'LogiTrack Backend running' });
});

app.use('/api', apiRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'NotFound', message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
