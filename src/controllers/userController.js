const userService = require('../services/userService');
const auth = require('../utils/auth');
const response = require('../utils/response');

/**
 * POST /register
 * Create a new user account with validated and hashed password
 * @param {Object} req - Express request object
 * @param {Object} req.body - Validated request body (name, email, password)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 201 JSON response with created user or error via next()
 * @throws {Error} Passed to next() for centralized error handling
 */
exports.register = async (req, res, next) => {
    try {
        const user = await userService.registerUser(req.body);
        response.success(res, {
            message: 'Account created!',
            user
        }, 201);
    } catch (err) {
        next(err);
    }
};

/**
 * POST /login
 * Authenticate user with email and password, return JWT token
 * @param {Object} req - Express request object
 * @param {Object} req.body - Validated request body (email, password)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 200 JSON response with token and user data or error via next()
 * @throws {Error} Passed to next() for centralized error handling
 */
exports.login = async (req, res, next) => {
    try {
        const user = await userService.loginUser(req.body.email, req.body.password);
        const token = auth.generateToken(user._id, user.role);

        response.success(res, {
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /profile
 * Get current authenticated user's profile
 * @param {Object} req - Express request object
 * @param {string} req.userId - Authenticated user's MongoDB ObjectId
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 200 JSON response with user profile or error via next()
 * @throws {Error} Passed to next() for centralized error handling
 */
exports.getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserProfile(req.userId);
        response.success(res, user);
    } catch (err) {
        next(err);
    }
};
