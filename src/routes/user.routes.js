const { Router } = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @auth    Required
 * @returns {200} User document
 */
router.get('/profile', userController.getProfile);

module.exports = router;
