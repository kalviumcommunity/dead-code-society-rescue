require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// Middleware
const errorHandler = require('./middlewares/error.middleware')

// Routes
const authRoutes = require('./routes/auth.routes')
const shipmentRoutes = require('./routes/shipment.routes')

const app = express()

// Middleware setup
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack'
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✓ Database connected successfully')
  })
  .catch((err) => {
    console.error('✗ Database connection error:', err.message)
    process.exit(1)
  })

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'LogiTrack Backend is running',
    version: '2.0.0'
  })
})

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/shipments', shipmentRoutes)

// 404 handler
app.use((req, res, next) => {
  const { NotFoundError } = require('./utils/errors.util')
  next(new NotFoundError(`Route ${req.originalUrl} not found`))
})

// Centralized error handler MUST be last
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// exporting for testing later
module.exports = app;
