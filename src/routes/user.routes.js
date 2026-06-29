var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');
var authMiddleware = require('../middlewares/auth.middleware');

router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;
