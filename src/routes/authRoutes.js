const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validateBody, registerSchema, loginSchema } = require('../utils/validation');

const router = express.Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
