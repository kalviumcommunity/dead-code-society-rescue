var express = require('express');
var router = express.Router();
var authMiddleware = require('../middlewares/auth.middleware');
var userController = require('../controllers/user.controller');

router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;
