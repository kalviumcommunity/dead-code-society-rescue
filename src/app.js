require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

// routes
const authRoutes = require('./routes/auth.routes')
const shipmentRoutes = require('./routes/shipment.routes')
const errorHandler = require('./middlewares/error.middleware')

const app = express()

// middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(errorHandler)

// database connection
const mongoUrl = process.env.DATABASE_URL

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('--- DATABASE CONNECTED ---')
  })
  .catch(err => {
    console.log('DATABASE CONNECTION ERROR:')
    console.log(err)
  })

// routes
app.use('/api/auth', authRoutes)
app.use('/api/shipments', shipmentRoutes)

// welcome route
app.get('/', (req, res) => {
  res.json({ message: 'LogiTrack Backend running' })
})

// start server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('Server is alive on port ' + PORT)
  console.log('Wait for MongoDB before testing...')
})

module.exports = app