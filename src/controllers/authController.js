const authService = require('../services/authService');
const { sendJson } = require('../utils/response');

/**
 * Handles user registration requests.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the created user response or passes an error onward.
 * @throws {Error} Any service error is forwarded to the error handler.
 */
async function register(req, res, next) {
    const user = await authService.registerUser(req.body);
    return sendJson(res, 201, {
        success: true,
        message: 'Account created!',
        user: user
    });
}

/**
 * Handles login requests.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the JWT response or passes an error onward.
 * @throws {Error} Any service error is forwarded to the error handler.
 */
async function login(req, res, next) {
    const result = await authService.loginUser(req.body);
    return sendJson(res, 200, {
        msg: 'Login OK',
        token: result.token,
        data: result.user
    });
}

module.exports = {
    register: register,
    login: login
};
