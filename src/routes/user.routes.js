/**
 * User Routes - Auth and profile endpoints
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validation.middleware');
const { registerSchema, loginSchema } = require('../validators/schemas.validator');

// POST /auth/register
router.post('/register', validateRequest(registerSchema), userController.register);

// POST /auth/login
router.post('/login', validateRequest(loginSchema), userController.login);

// GET /auth/profile
router.get('/profile', authenticate, userController.getProfile);

module.exports = router;
