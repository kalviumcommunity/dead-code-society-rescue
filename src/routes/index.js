const express = require('express');

const authController = require('../controllers/auth.controller');
const shipmentController = require('../controllers/shipment.controller');
const systemController = require('../controllers/system.controller');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validateBody } = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const {
    createShipmentSchema,
    updateShipmentStatusSchema
} = require('../validators/shipment.validator');

const router = express.Router();

router.get('/status', systemController.status);
router.get('/ping', systemController.ping);
router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.get('/profile', authMiddleware, userController.profile);
router.get('/shipments', authMiddleware, shipmentController.listShipments);
router.get('/shipments/:id', authMiddleware, shipmentController.getShipment);
router.post('/shipments', authMiddleware, validateBody(createShipmentSchema), shipmentController.createShipment);
router.patch('/shipments/:id/status', authMiddleware, validateBody(updateShipmentStatusSchema), shipmentController.updateShipmentStatus);
router.delete('/shipments/:id', authMiddleware, shipmentController.deleteShipment);

module.exports = router;