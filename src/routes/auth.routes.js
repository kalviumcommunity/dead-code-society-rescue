const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const validateBody = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.get('/profile', authMiddleware, authController.profile);

module.exports = router;
