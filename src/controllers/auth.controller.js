const authService = require('../services/auth.service');
const { sendCreated, sendOk } = require('../utils/response.util');

/**
 * Registers a new user and returns the created user document.
 *
 * @param {import('express').Request} req - Express request object containing the registration payload.
 * @param {import('express').Response} res - Express response object used to send the result.
 * @param {import('express').NextFunction} next - Express next callback for centralized error handling.
 * @returns {Promise<void>}
 * @throws {ConflictError} If the email address is already taken.
 * @throws {ValidationError} If the request body fails validation.
 */
async function register(req, res, next) {
    try {
        const user = await authService.registerUser(req.body);

        return sendCreated(res, {
            message: 'Account created',
            user
        });
    } catch (error) {
        return next(error);
    }
}

/**
 * Authenticates a user and returns a signed JWT.
 *
 * @param {import('express').Request} req - Express request object containing credentials.
 * @param {import('express').Response} res - Express response object used to send the result.
 * @param {import('express').NextFunction} next - Express next callback for centralized error handling.
 * @returns {Promise<void>}
 * @throws {NotFoundError} If no user exists for the provided email.
 * @throws {UnauthorizedError} If the password does not match.
 */
async function login(req, res, next) {
    try {
        const result = await authService.loginUser(req.body);

        return sendOk(res, {
            message: 'Login OK',
            token: result.token,
            data: result.user
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    register,
    login
};