const authService = require('../services/auth.service');

/**
 * Controller handling user registration request.
 * Responds with 201 status and the registered user record on success.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 */
async function register(req, res, next) {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: 'Account created!',
            user: user
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Controller handling user login requests.
 * Responds with a signed JWT token on success.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 */
async function login(req, res, next) {
    try {
        const data = await authService.loginUser(req.body.email, req.body.password);
        res.json({
            msg: 'Login OK',
            token: data.token,
            data: data.user
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Controller handling requests for retrieving user profiles.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 */
async function getProfile(req, res, next) {
    try {
        const user = await authService.getUserProfile(req.userId);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register: register,
    login: login,
    getProfile: getProfile
};
