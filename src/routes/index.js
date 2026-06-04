const express = require('express');
const authRoutes = require('./auth.routes');
const shipmentRoutes = require('./shipment.routes');
const userRoutes = require('./user.routes');
const healthController = require('../controllers/health.controller');
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate.middleware');
const {
  registerSchema,
  loginSchema,
} = require('../validators/auth.validator');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/', userRoutes);

router.get('/health', healthController.health);
router.get('/status', healthController.status);
router.get('/ping', healthController.ping);

// Legacy paths (same handlers as /api/auth/*)
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
