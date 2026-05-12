var express = require('express');
var router = express.Router();
var shipmentController = require('../controllers/shipmentController');
var authMiddleware = require('../middlewares/authMiddleware');

// All shipment routes require authentication
router.use(authMiddleware.verifyToken);

router.post('/', shipmentController.createShipment);
router.get('/', shipmentController.getShipments);
router.get('/:id', shipmentController.getShipmentById);
router.patch('/:id/status', shipmentController.updateStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
