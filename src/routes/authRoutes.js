/**
 * User authentication routes.
 * POST /auth/register - Register new user
 * POST /auth/login - Authenticate user
 * GET /auth/profile - Get current user profile (requires auth)
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/auth");

/**
 * POST /auth/register
 * Register a new user account.
 */
router.post("/register", userController.register);

/**
 * POST /auth/login
 * Authenticate user and return JWT token.
 */
router.post("/login", userController.login);

/**
 * GET /auth/profile
 * Get current user's profile. Requires authentication.
 */
router.get("/profile", authMiddleware, userController.getProfile);

module.exports = router;
