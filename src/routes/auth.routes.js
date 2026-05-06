/**
 * Authentication routes
 * Public endpoints for user registration and login
 */

const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/user.validator');

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user account
 * 
 * Body: { name, email, password }
 * Response: { message, user, (no token for now) } or error
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * POST /api/auth/login
 * Login and receive JWT token
 * 
 * Body: { email, password }
 * Response: { message, user, token } or error
 */
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
