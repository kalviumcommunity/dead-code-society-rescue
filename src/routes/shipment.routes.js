var express = require('express');
var router = express.Router();
var authMiddleware = require('../middlewares/auth.middleware');
var validate = require('../middlewares/validate.middleware');
var shipmentValidator = require('../validators/shipment.validator');
var shipmentController = require('../controllers/shipment.controller');

router.use(authMiddleware);

router.get('/', shipmentController.listShipments);
router.get('/:id', shipmentController.getShipment);
router.post('/', validate(shipmentValidator.createShipmentSchema), shipmentController.create);
router.patch('/:id/status', validate(shipmentValidator.updateShipmentStatusSchema), shipmentController.updateStatus);
router.delete('/:id', shipmentController.remove);

module.exports = router;
