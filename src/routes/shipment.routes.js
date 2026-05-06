const express = require('express');

const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const shipmentController = require('../controllers/shipment.controller');
const { objectIdParamSchema } = require('../validators/common.validator');
const { createShipmentSchema, updateShipmentStatusSchema } = require('../validators/shipment.validator');

const router = express.Router();

router.get('/shipments', authenticate, shipmentController.list);
router.get('/shipments/:id', authenticate, validate(objectIdParamSchema, 'params'), shipmentController.show);
router.post('/shipments', authenticate, validate(createShipmentSchema), shipmentController.create);
router.patch('/shipments/:id/status', authenticate, validate(objectIdParamSchema, 'params'), validate(updateShipmentStatusSchema), shipmentController.updateStatus);
router.delete('/shipments/:id', authenticate, validate(objectIdParamSchema, 'params'), shipmentController.remove);

module.exports = router;