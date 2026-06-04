require('dotenv').config();
// SMELL: [MEDIUM] var used everywhere causing hoisting bugs. Use const/let.
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

var authRoutes = require('./routes/auth.routes');
var shipmentRoutes = require('./routes/shipment.routes');
var userRoutes = require('./routes/user.routes');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(function() { console.log('--- DATABASE CONNECTED ---'); })
.catch(function(err) { console.log('DATABASE CONNECTION ERROR:'); console.log(err); });

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/users', userRoutes);

app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
});

module.exports = app;
