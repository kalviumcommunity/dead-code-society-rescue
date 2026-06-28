const authService = require("../services/auth.service");

/**
 * Handles POST /api/auth/register. Delegates to the auth service and responds
 * with the created user, or forwards any error to the centralized handler.
 * @param {import('express').Request} req - Express request; req.body is the validated registration payload
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function, used to forward errors
 * @returns {Promise<void>}
 */
const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handles POST /api/auth/login. Delegates to the auth service and responds
 * with a signed JWT and the matched user, or forwards any error to the centralized handler.
 * @param {import('express').Request} req - Express request; req.body is the validated login payload
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function, used to forward errors
 * @returns {Promise<void>}
 */
const login = async (req, res, next) => {
    try {
        const result = await authService.login(
            req.body.email,
            req.body.password
        );

        res.json({
            success: true,
            token: result.token,
            user: result.user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login
};