/**
 * User routes
 * Protected endpoints for user profile operations
 */

const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

/**
 * GET /api/users/profile
 * Get current authenticated user's profile
 * 
 * Headers: Authorization: <token>
 * Response: { message, user }
 */
router.get('/profile', authenticate, userController.getProfile);

module.exports = router;
