// SMELL: [MEDIUM] var used everywhere causing hoisting bugs. Use const/let.
var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
