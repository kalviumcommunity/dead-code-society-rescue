const authService = require('../services/auth.service');

/**
 * Creates a user account.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends the created user and JWT.
 */
async function register(req, res) {
    const result = await authService.registerUser(req.body);
    res.status(201).json({ success: true, ...result });
}

/**
 * Authenticates an existing user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends the authenticated user and JWT.
 */
async function login(req, res) {
    const result = await authService.loginUser(req.body);
    res.status(200).json({ success: true, ...result });
}

/**
 * Returns the current user's profile.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends the sanitized profile.
 */
async function profile(req, res) {
    const user = await authService.getProfile(req.user.id);
    res.status(200).json({ success: true, user });
}

module.exports = {
    login,
    profile,
    register,
};