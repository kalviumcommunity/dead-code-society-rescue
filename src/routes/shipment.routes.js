const router = require('express').Router()
const shipmentController = require('../controllers/shipment.controller')
const auth = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validate.middleware')
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator')

router.get('/', auth, shipmentController.getAll)
router.get('/:id', auth, shipmentController.getOne)

// ✅ Add validation here
router.post('/', auth, validate(createShipmentSchema), shipmentController.create)

router.patch('/:id/status', auth, validate(updateStatusSchema), shipmentController.updateStatus)

router.delete('/:id', auth, shipmentController.delete)

module.exports = router