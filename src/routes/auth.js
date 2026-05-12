const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validation');
const { registerSchema, loginSchema } = require('../validators/userValidator');

// Public routes
router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);

// Protected routes
router.get('/profile', authMiddleware.verifyToken, userController.getProfile);

module.exports = router;
