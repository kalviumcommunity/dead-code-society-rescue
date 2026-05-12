const express = require('express');

const authController = require('../controllers/auth.controller');
const asyncHandler = require('../utils/async-handler.util');
const { authenticate } = require('../middlewares/auth.middleware');
const validateBody = require('../middlewares/validate.middleware');
const { loginSchema, registerSchema } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validateBody(registerSchema), asyncHandler(authController.register));
router.post('/login', validateBody(loginSchema), asyncHandler(authController.login));
router.get('/profile', authenticate, asyncHandler(authController.profile));

module.exports = router;