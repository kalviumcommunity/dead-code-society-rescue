const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/profile', authenticate, userController.getProfile);

module.exports = router;
