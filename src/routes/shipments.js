const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const authMiddleware = require('../middlewares/authMiddleware');

// All shipment routes require authentication
router.use(authMiddleware.verifyToken);

router.post('/', shipmentController.createShipment);
router.get('/', shipmentController.getShipments);
router.get('/:id', shipmentController.getShipmentById);
router.patch('/:id/status', shipmentController.updateStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
