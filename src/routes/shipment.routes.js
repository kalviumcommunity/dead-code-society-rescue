const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');

router.use(authenticate);

router.get('/', shipmentController.list);
router.get('/:id', shipmentController.getById);
router.post('/', validate(createShipmentSchema), shipmentController.create);
router.patch('/:id/status', validate(updateStatusSchema), shipmentController.updateStatus);
router.delete('/:id', shipmentController.remove);

module.exports = router;
