const express = require('express');

const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const catchAsync = require('../utils/async.util');
const { loginSchema, registerSchema } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validate(registerSchema), catchAsync(authController.register));
router.post('/login', validate(loginSchema), catchAsync(authController.login));

module.exports = router;