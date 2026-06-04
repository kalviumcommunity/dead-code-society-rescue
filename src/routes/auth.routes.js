var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller');
var authenticate = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
