const { Router } = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = Router();

/**
 * GET /profile
 * Retrieve the current authenticated user's profile.
 */
router.get('/profile', requireAuth, userController.getProfile);
module.exports = router;
