const router = require('express').Router();
const shipmentController = require('../controllers/shipment.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validateBody } = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');

router.use(authMiddleware);

router.get('/', shipmentController.listShipments);
router.get('/:id', shipmentController.getShipmentById);
router.post('/', validateBody(createShipmentSchema), shipmentController.createShipment);
router.patch('/:id/status', validateBody(updateStatusSchema), shipmentController.updateShipmentStatus);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
