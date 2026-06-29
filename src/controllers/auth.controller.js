const authService = require('../services/auth.service');

/**
 * Express controller handling user registration.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        console.log('Registered user: ' + user.email);
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
 * Express controller handling user login.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
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
 * Express controller fetching the authenticated user's profile.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
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
