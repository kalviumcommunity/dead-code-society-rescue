const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// POST /register - make a new account
router.post('/register', register);

// POST /login - get a token
router.post('/login', login);

// GET /profile - current user
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
