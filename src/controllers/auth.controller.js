const { asyncHandler } = require('../utils/async.util');
const authService = require('../services/auth.service');

/**
 * Registers a new user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the created user response.
 */
const register = asyncHandler(async function register(req, res) {
    const result = await authService.registerUser(req.body);
    res.status(201).json({
        success: true,
        message: 'Account created!',
        user: result.user
    });
});

/**
 * Authenticates a user and returns a JWT.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the login response.
 */
const login = asyncHandler(async function login(req, res) {
    const result = await authService.loginUser(req.body.email, req.body.password);
    res.json({
        msg: 'Login OK',
        token: result.token,
        data: result.user
    });
});

module.exports = {
    register,
    login
};