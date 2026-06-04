require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log('--- DATABASE CONNECTED ---'))
.catch(err => console.log('DATABASE CONNECTION ERROR:', err));

app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({ message: 'LogiTrack Backend running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is alive on port ${PORT}`);
});

module.exports = app;

// exporting for testing later
module.exports = app;
