require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

// routes
var routes = require('./routes');
var errorHandler = require('./middlewares/errorHandler');

var app = express();

// middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
var mongoUrl = process.env.DATABASE_URL;
if (!mongoUrl) {
    throw new Error('DATABASE_URL is required');
}

var PORT = process.env.PORT || 3000;

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(function() {
    console.log('--- DATABASE CONNECTED ---');
    app.listen(PORT, function() {
        console.log('Server is alive on port ' + PORT);
        console.log('Wait for MongoDB before testing...');
    });
})
.catch(function(err) {
    console.log('DATABASE CONNECTION ERROR:');
    console.log(err);
    process.exit(1);
});

// register routes
app.use('/api', routes); // all routes under /api

// no 404 handler here, let express handle it for now

app.use(errorHandler);

// exporting for testing later
module.exports = app;
