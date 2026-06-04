const { Router } = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = Router();

router.get('/profile', authenticate, userController.getProfile);

module.exports = router;
