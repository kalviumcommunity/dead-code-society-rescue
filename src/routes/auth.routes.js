var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller');
var validate = require('../middlewares/validate.middleware');
var authValidator = require('../validators/auth.validator');

router.post('/register', validate(authValidator.registerSchema), authController.register);
router.post('/login', validate(authValidator.loginSchema), authController.login);

module.exports = router;
