/**
 * User routes
 */

const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

/**
 * GET /api/users/profile
 * Get current user's profile
 */
router.get('/profile', userController.getProfile);

module.exports = router;
