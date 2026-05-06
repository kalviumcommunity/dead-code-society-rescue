const { Router } = require('express')
const validate = require('../middlewares/validate.middleware')
const { authMiddleware } = require('../middlewares/auth.middleware')
const { registerSchema, loginSchema } = require('../validators/auth.validator')
const authController = require('../controllers/auth.controller')

const router = Router()

/**
 * POST /api/auth/register
 * Register a new user account.
 * Body: { email, password, name }
 */
router.post('/register', validate(registerSchema), authController.register)

/**
 * POST /api/auth/login
 * Authenticate user and receive JWT token.
 * Body: { email, password }
 */
router.post('/login', validate(loginSchema), authController.login)

/**
 * GET /api/auth/profile
 * Fetch current authenticated user's profile.
 * Requires: Valid JWT token in Authorization header
 */
router.get('/profile', authMiddleware, authController.getProfile)

module.exports = router
