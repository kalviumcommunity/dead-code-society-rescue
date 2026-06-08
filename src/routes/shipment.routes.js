const { Router } = require('express');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateShipmentStatusSchema } = require('../validators/shipment.validator');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');
const shipmentController = require('../controllers/shipment.controller');

const router = Router();

router.post('/', requireAuth, validate(createShipmentSchema), shipmentController.create);
router.get('/', requireAuth, shipmentController.list);
router.get('/:id', requireAuth, shipmentController.getOne);
router.patch('/:id/status', requireAuth, requireAdmin, validate(updateShipmentStatusSchema), shipmentController.updateStatus);
router.delete('/:id', requireAuth, requireAdmin, shipmentController.deleteOne);

module.exports = router;
