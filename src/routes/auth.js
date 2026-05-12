var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authMiddleware.verifyToken, userController.getProfile);

module.exports = router;
