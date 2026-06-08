const { Router } = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = Router();

router.get('/profile', requireAuth, userController.getProfile);

module.exports = router;
