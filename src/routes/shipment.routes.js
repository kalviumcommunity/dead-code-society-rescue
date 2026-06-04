const express = require('express');

const shipmentController = require('../controllers/shipment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validateBody } = require('../middlewares/validate.middleware');
const {
	createShipmentSchema,
	updateShipmentStatusSchema
} = require('../validators/shipment.validator');

const router = express.Router();

router.get('/shipments', authMiddleware, shipmentController.list);
router.get('/shipments/:id', authMiddleware, shipmentController.getById);
router.post(
	'/shipments',
	authMiddleware,
	validateBody(createShipmentSchema),
	shipmentController.create
);
router.patch(
	'/shipments/:id/status',
	authMiddleware,
	validateBody(updateShipmentStatusSchema),
	shipmentController.updateStatus
);
router.delete('/shipments/:id', authMiddleware, shipmentController.remove);

module.exports = router;
