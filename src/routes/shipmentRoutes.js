const express = require('express');
const {
  listShipments,
  getShipment,
  createShipment,
  updateShipmentStatus,
  deleteShipment,
} = require('../controllers/shipmentController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  shipmentIdParamSchema,
  createShipmentSchema,
  updateStatusSchema,
} = require('../validators/shipmentValidators');

const router = express.Router();

router.use(authenticate);

router.get('/shipments', listShipments);
router.get('/shipments/:id', validate(shipmentIdParamSchema, 'params'), getShipment);
router.post('/shipments', validate(createShipmentSchema), createShipment);
router.patch(
  '/shipments/:id/status',
  validate(shipmentIdParamSchema, 'params'),
  validate(updateStatusSchema),
  updateShipmentStatus
);
router.delete('/shipments/:id', validate(shipmentIdParamSchema, 'params'), deleteShipment);

module.exports = router;
