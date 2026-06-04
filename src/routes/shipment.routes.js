const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');

router.use(protect);

router.get('/', shipmentController.getAll);
router.get('/:id', shipmentController.getOne);
router.post('/', validate(createShipmentSchema), shipmentController.create);
router.patch('/:id/status', validate(updateStatusSchema), shipmentController.updateStatus);
router.delete('/:id', shipmentController.remove);

module.exports = router;
