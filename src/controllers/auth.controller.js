const authService = require('../services/auth.service');

/**
 * Handles user registration request.
 * @param {import('express').Request} req - Express request object containing user data
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 * @throws {Error} If registration fails
 */
const register = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ success: true, message: 'Account created!', user });
    } catch (err) {
        next(err);
    }
};

/**
 * Handles user login request.
 * @param {import('express').Request} req - Express request object containing credentials
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 * @throws {UnauthorizedError} If login fails
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        res.status(200).json({ msg: 'Login OK', ...result });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
