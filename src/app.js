require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Models
const User = require('../models/User');
const Shipment = require('../models/Shipment');

// Route Imports
const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const userRoutes = require('./routes/user.routes');
const systemRoutes = require('./routes/system.routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
const mongoUrl =
  process.env.DATABASE_URL ||
  'mongodb://localhost:27017/logitrack';

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(function () {
    console.log('--- DATABASE CONNECTED ---');
  })
  .catch(function (err) {
    console.log('DATABASE CONNECTION ERROR:');
    console.log(err);
  });

// Routes
app.use('/api', authRoutes);
app.use('/api', shipmentRoutes);
app.use('/api', userRoutes);
app.use('/api', systemRoutes);

// Home Route
app.get('/', function (req, res) {
  res.json({
    message: 'LogiTrack Backend running'
  });
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Server is alive on port ' + PORT);
  console.log('Wait for MongoDB before testing...');
});

module.exports = app;