var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');
var authenticate = require('../middlewares/auth.middleware');

router.get('/profile', authenticate, userController.getProfile);

module.exports = router;
