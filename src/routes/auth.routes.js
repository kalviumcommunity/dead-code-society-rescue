const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { registerUserSchema, loginUserSchema } = require('../validators/user.validator');

router.post('/register', validate(registerUserSchema), authController.register);
router.post('/login', validate(loginUserSchema), authController.login);

module.exports = router;
