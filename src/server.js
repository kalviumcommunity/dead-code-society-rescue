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
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Note: useCreateIndex and useFindAndModify are deprecated in newest mongoose, but let's keep logic
})
.then(() => console.log('--- DATABASE CONNECTED ---'))
.catch(err => {
    console.log('DATABASE CONNECTION ERROR:');
    console.log(err);
});

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'LogiTrack Backend running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
