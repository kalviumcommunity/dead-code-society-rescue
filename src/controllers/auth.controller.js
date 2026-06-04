const authService = require('../services/auth.service');

/**
 * Controller endpoint to handle user registration.
 *
 * @param {import('express').Request} req - Express request object containing registration details
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 * @returns {Promise<void>}
 */
const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'Account created!',
            user: user
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Controller endpoint to handle user login.
 *
 * @param {import('express').Request} req - Express request object containing email and password
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 * @returns {Promise<void>}
 */
const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body.email, req.body.password);
        res.json({
            msg: 'Login OK',
            token: result.token,
            data: result.user
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Controller endpoint to retrieve the current user's profile.
 *
 * @param {import('express').Request} req - Express request object containing authenticated userId
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 * @returns {Promise<void>}
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.userId);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    getProfile
};
