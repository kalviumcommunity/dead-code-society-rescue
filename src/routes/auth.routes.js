/**
 * @file auth.routes.js
 * @description Routes for authentication operations
 */

const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login user and get JWT
 * @access Public
 */
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
