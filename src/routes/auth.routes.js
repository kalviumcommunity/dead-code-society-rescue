const { Router } = require('express');
const validate = require('../middlewares/validate.middleware');
const authController = require('../controllers/auth.controller');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const router = Router();

/**
 * POST /auth/register
 * Register a new user account.
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * POST /auth/login
 * Authenticate user and receive JWT token.
 */
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
