const authService = require('../services/auth.service');

/**
 * Handles user registration.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        const userObj = user.toObject();
        delete userObj.password;

        res.status(201).json({
            success: true,
            message: 'Account created!',
            user: userObj
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Handles user login.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json({
            msg: 'Login OK',
            token: result.token,
            data: result.user
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login
};
