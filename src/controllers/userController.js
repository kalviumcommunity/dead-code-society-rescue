/**
 * User controller.
 * Handles HTTP requests for user authentication and profile.
 */

const userService = require("../services/userService");
const { generateToken } = require("../utils/jwt");
const {
  sendSuccess,
  sendValidationError,
  sendError,
} = require("../utils/response");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../utils/validation");

/**
 * POST /auth/register
 * Register a new user account.
 */
async function register(req, res, next) {
  try {
    // Validate and sanitize input
    const userData = validateUserRegistration(req.body);

    // Register user
    const user = await userService.registerUser(userData);

    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return sendSuccess(res, { user: userResponse }, 201); // 201 Created
  } catch (err) {
    if (err.statusCode === 409) {
      return sendError(res, err.message, 409); // Conflict
    }
    if (err.message.includes("required") || err.message.includes("must be")) {
      return sendValidationError(res, err.message);
    }
    next(err); // Pass to error handler
  }
}

/**
 * POST /auth/login
 * Authenticate user and return JWT token.
 */
async function login(req, res, next) {
  try {
    // Validate and sanitize input
    const credentials = validateUserLogin(req.body);

    // Authenticate user
    const user = await userService.authenticateUser(
      credentials.email,
      credentials.password,
    );

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return sendSuccess(res, { token, user: userResponse });
  } catch (err) {
    if (err.statusCode === 401) {
      return sendError(res, err.message, 401); // Unauthorized
    }
    if (err.message.includes("must be")) {
      return sendValidationError(res, err.message);
    }
    next(err);
  }
}

/**
 * GET /auth/profile
 * Get current user's profile. Requires authentication.
 */
async function getProfile(req, res, next) {
  try {
    const userId = req.user.id; // From auth middleware
    const user = await userService.getUserProfile(userId);

    return sendSuccess(res, { user });
  } catch (err) {
    if (err.statusCode === 404) {
      return sendError(res, err.message, 404); // Not Found
    }
    next(err);
  }
}

module.exports = {
  register,
  login,
  getProfile,
};
