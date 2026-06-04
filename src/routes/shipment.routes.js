const express = require('express');
const shipmentController = require('../controllers/shipment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createShipmentSchema,
  updateStatusSchema,
} = require('../validators/shipment.validator');

const router = express.Router();

router.use(authenticate);

router.get('/', shipmentController.list);
router.get('/:id', shipmentController.getOne);
router.post('/', validate(createShipmentSchema), shipmentController.create);
router.patch(
  '/:id/status',
  validate(updateStatusSchema),
  shipmentController.updateStatus
);
router.delete('/:id', shipmentController.remove);

module.exports = router;
