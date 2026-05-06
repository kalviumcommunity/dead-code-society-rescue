const authService = require('../services/auth.service');

/**
 * POST /api/auth/register
 * Registers a new user account.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            message: 'Account created successfully',
            user,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a signed JWT.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const login = async (req, res, next) => {
    try {
        const { user, token } = await authService.login(req.body.email, req.body.password);
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
