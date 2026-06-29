// ADDED: Shipment router defining shipment management routes with auth and validations.
const { Router } = require('express');
const shipmentController = require('../controllers/shipment.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');

const router = Router();

// Apply auth middleware to all shipment routes
router.use(auth);

router.get('/', shipmentController.list);
router.get('/:id', shipmentController.getById);
router.post('/', validate(createShipmentSchema), shipmentController.create);
router.patch('/:id/status', validate(updateStatusSchema), shipmentController.updateStatus);
router.delete('/:id', shipmentController.remove);

module.exports = router;
