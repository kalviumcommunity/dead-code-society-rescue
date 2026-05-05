const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validators');

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @body    {string} email, {string} password, {string} name
 * @returns {201} Created user
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and receive JWT token
 * @body    {string} email, {string} password
 * @returns {200} User data and JWT token
 */
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
