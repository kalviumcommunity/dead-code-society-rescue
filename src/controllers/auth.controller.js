const authService = require('../services/auth.service');

/**
 * Handles user registration.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const register = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ success: true, message: 'Account created!', user: user });
    } catch (err) {
        next(err);
    }
};

/**
 * Handles user login.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body.email, req.body.password);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
