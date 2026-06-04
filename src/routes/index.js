const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const shipmentController = require('../controllers/shipmentController');
const systemController = require('../controllers/systemController');
const userController = require('../controllers/userController');

const asyncHandler = require('../utils/asyncHandler');
const auth = require('../middlewares/auth.middleware');
const { validateBody } = require('../middlewares/validate');
const registerSchema = require('../validators/register');
const loginSchema = require('../validators/login');
const shipmentCreateSchema = require('../validators/shipmentCreate');
const shipmentStatusSchema = require('../validators/shipmentStatus');

router.get('/', systemController.home);
router.get('/status', systemController.status);
router.get('/ping', systemController.ping);

router.post('/register', validateBody(registerSchema), asyncHandler(authController.register));
router.post('/login', validateBody(loginSchema), asyncHandler(authController.login));

router.get('/profile', auth, asyncHandler(userController.profile));
router.get('/shipments', auth, asyncHandler(shipmentController.listShipments));
router.get('/shipments/:id', auth, asyncHandler(shipmentController.getShipment));
router.post('/shipments', auth, validateBody(shipmentCreateSchema), asyncHandler(shipmentController.createShipment));
router.patch('/shipments/:id/status', auth, validateBody(shipmentStatusSchema), asyncHandler(shipmentController.updateShipmentStatus));
router.delete('/shipments/:id', auth, asyncHandler(shipmentController.deleteShipment));

module.exports = router;
