const express = require('express');
const shipmentController = require('../controllers/shipmentController');
const { authenticate, authorizeRole } = require('../middlewares/auth');
const { validateBody, shipmentSchema, statusSchema } = require('../utils/validation');

const router = express.Router();

router.get('/shipments', authenticate, shipmentController.listShipments);
router.get('/shipments/:id', authenticate, shipmentController.getShipment);
router.post('/shipments', authenticate, validateBody(shipmentSchema), shipmentController.createShipment);
router.patch('/shipments/:id/status', authenticate, authorizeRole('admin'), validateBody(statusSchema), shipmentController.updateStatus);
router.delete('/shipments/:id', authenticate, shipmentController.deleteShipment);

module.exports = router;
