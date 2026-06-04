const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/profile', authenticate, userController.getProfile);

module.exports = router;
