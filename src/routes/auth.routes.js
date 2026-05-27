const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

// POST /register - make a new account
router.post('/register', validate(registerSchema), register);

// POST /login - get a token
router.post('/login', validate(loginSchema), login);

// GET /profile - current user
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
