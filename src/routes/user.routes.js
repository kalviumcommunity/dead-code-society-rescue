const express = require('express');

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/profile', authMiddleware, userController.profile);

module.exports = router;
