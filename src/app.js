const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const errorHandler = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const shipmentRoutes = require('./routes/shipment.routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shipments', shipmentRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: 'NotFound',
        message: `Route ${req.method} ${req.path} not found`,
    });
});

app.use(errorHandler);

module.exports = app;
