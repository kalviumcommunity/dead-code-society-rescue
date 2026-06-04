const authService = require('../services/auth.service');

/**
 * Register a new user and return the created record.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next handler.
 * @returns {Promise<void>} Sends a JSON response.
 * @throws {Error} Propagates unexpected service errors.
 */
const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        // SMELL: [HIGH] Returning the full user object can leak password hashes and internal fields.
        res.json({
            success: true,
            message: 'Account created!',
            user: user
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Authenticate a user and return a JWT.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next handler.
 * @returns {Promise<void>} Sends a JSON response.
 * @throws {Error} Propagates unexpected service errors.
 */
const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body.email, req.body.password);
        if (result.error) {
            return res.json({ error: result.error });
        }

        res.json({
            msg: 'Login OK',
            token: result.token,
            data: {
                name: result.user.name,
                email: result.user.email,
                role: result.user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login
};
