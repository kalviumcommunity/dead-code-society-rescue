const userService = require('../services/user.service');

/**
 * Handle user registration request.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const register = async (req, res, next) => {
    try {
        const user = await userService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: 'Account created!',
            user
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Handle user login request.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password);
        res.status(200).json({
            msg: 'Login OK',
            ...result
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login
};
