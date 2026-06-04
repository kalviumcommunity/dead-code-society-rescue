const express = require('express');

const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const catchAsync = require('../utils/async.util');

const router = express.Router();

router.get('/profile', authenticate, catchAsync(userController.getProfile));

module.exports = router;