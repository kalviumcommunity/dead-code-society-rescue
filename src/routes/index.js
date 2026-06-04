const router = require('express').Router()

const authRoutes = require('./auth.routes')
const shipmentRoutes = require('./shipment.routes')

router.use('/auth', authRoutes)
router.use('/shipments', shipmentRoutes)

router.get('/status', (req, res) => {
  res.json({ status: 'OK' })
})

router.get('/ping', (req, res) => {
  res.json({ pong: 'active' })
})

module.exports = router