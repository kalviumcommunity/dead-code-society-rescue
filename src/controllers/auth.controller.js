const authService = require('../services/auth.service');

/**
 * POST /api/auth/register
 * Creates a new user account and returns the saved user object.
 *
 * @param {import('express').Request}  req - Body validated by registerSchema
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a signed JWT token.
 *
 * @param {import('express').Request}  req - Body validated by loginSchema
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const login = async (req, res, next) => {
    try {
        const { user, token } = await authService.login(req.body.email, req.body.password);
        res.status(200).json({ success: true, token, data: user });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/auth/profile
 * Returns the profile of the currently authenticated user.
 *
 * @param {import('express').Request}  req - Must have req.userId set by auth middleware
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.userId);
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, getProfile };
