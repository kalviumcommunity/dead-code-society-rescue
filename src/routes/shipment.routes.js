const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, shipmentController.listShipments);
router.get('/:id', authMiddleware, shipmentController.getShipment);
router.post('/', authMiddleware, shipmentController.createShipment);
router.patch('/:id/status', authMiddleware, shipmentController.updateShipmentStatus);
router.delete('/:id', authMiddleware, shipmentController.deleteShipment);

module.exports = router;
