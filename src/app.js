require('dotenv').config();

const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'LogiTrack Backend running' });
});

app.use('/api', apiRoutes);
app.use(errorHandler);

module.exports = app;
