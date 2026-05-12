const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validation');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipmentValidator');

// All shipment routes require authentication
router.use(authMiddleware.verifyToken);

router.post('/', validate(createShipmentSchema), shipmentController.createShipment);
router.get('/', shipmentController.getShipments);
router.get('/:id', shipmentController.getShipmentById);
router.patch('/:id/status', validate(updateStatusSchema), shipmentController.updateStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
