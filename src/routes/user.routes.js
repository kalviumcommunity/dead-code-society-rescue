const express = require('express');

const authenticate = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/users/profile', authenticate, userController.profile);

module.exports = router;