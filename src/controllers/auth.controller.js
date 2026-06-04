const authService = require('../services/auth.service');

/**
 * Handles user registration.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
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
 * Handles user login.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body.email, req.body.password);
        if (result.error) {
            return res.status(401).json({ error: result.error });
        }
        res.json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
