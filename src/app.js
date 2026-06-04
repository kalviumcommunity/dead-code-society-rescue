require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// routes
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
const mongoUrl = process.env.DATABASE_URL;
if (!mongoUrl) {
    throw new Error('DATABASE_URL is required');
}

const PORT = process.env.PORT;

async function startServer() {
    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('--- DATABASE CONNECTED ---');
        app.listen(PORT, function() {
            console.log('Server is alive on port ' + PORT);
            console.log('Wait for MongoDB before testing...');
        });
    } catch (err) {
        console.log('DATABASE CONNECTION ERROR:');
        console.log(err);
        process.exit(1);
    }
}

startServer();

// register routes
app.use('/api', routes); // all routes under /api

// no 404 handler here, let express handle it for now

app.use(errorHandler);

// exporting for testing later
module.exports = app;
