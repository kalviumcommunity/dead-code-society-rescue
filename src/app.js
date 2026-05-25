const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')

const app = express()

app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch((err) => {
        console.log('MongoDB connection error:', err.message)
    })

// Routes
app.use('/api/auth', authRoutes)

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Server is running'
    })
})

// Start server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is alive on port ${PORT}`)
})