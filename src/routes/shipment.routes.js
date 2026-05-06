const { Router } = require('express');
const shipmentController = require('../controllers/shipment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validateBody = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateShipmentStatusSchema } = require('../validators/shipment.validator');

const router = Router();

router.use(authMiddleware);
router.get('/', shipmentController.list);
router.get('/:id', shipmentController.getById);
router.post('/', validateBody(createShipmentSchema), shipmentController.create);
router.patch('/:id/status', validateBody(updateShipmentStatusSchema), shipmentController.updateStatus);
router.delete('/:id', shipmentController.remove);

module.exports = router;
