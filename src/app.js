require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Routes
const apiRoutes = require('./routes');

// Middlewares
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
(async () => {
    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('--- DATABASE CONNECTED ---');
    } catch (err) {
        console.log('DATABASE CONNECTION ERROR:');
        console.log(err);
    }
})();

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'LogiTrack Backend running' });
});

// Register API routes
app.use('/api', apiRoutes);

// 404 handler (before error handler)
app.use(errorHandler.notFound);

// Global error handler (MUST BE LAST)
app.use(errorHandler.errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// Exporting for testing
module.exports = app;
