var express = require('express');
var router = express.Router();
var authMiddleware = require('../middlewares/auth.middleware');
var shipmentController = require('../controllers/shipment.controller');

router.use(authMiddleware);

router.get('/', shipmentController.listShipments);
router.get('/:id', shipmentController.getShipment);
router.post('/', shipmentController.create);
router.patch('/:id/status', shipmentController.updateStatus);
router.delete('/:id', shipmentController.remove);

module.exports = router;
