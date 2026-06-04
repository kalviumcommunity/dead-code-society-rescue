const router = require('express').Router()

const auth = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validate.middleware')

const shipmentController =
  require('../controllers/shipment.controller')

const {
  createShipmentSchema,
  updateShipmentStatusSchema
} = require('../validators/shipment.validator')

router.get(
  '/',
  auth,
  shipmentController.getAll
)

router.get(
  '/:id',
  auth,
  shipmentController.getById
)

router.post(
  '/',
  auth,
  validate(createShipmentSchema),
  shipmentController.create
)

router.patch(
  '/:id/status',
  auth,
  validate(updateShipmentStatusSchema),
  shipmentController.updateStatus
)

router.delete(
  '/:id',
  auth,
  shipmentController.remove
)

module.exports = router