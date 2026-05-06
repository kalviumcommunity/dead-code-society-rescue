/**
 * Authentication controller
 * Thin layer that handles register and login requests
 * Delegates business logic to authService
 */

const authService = require('../services/auth.service');

/**
 * Register a new user.
 * Request body should contain: name, email, password (validated by middleware)
 * Response: User data and JWT token on success
 *
 * @param {import('express').Request} req - Express request with validated body
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 *
 * @example
 * POST /api/auth/register
 * Body: { name: "John", email: "john@example.com", password: "SecurePass123" }
 * Response: 201 { user: {...}, token: "eyJhbGc..." }
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const result = await authService.register({
            name,
            email,
            password
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: result
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Login a user.
 * Request body should contain: email, password (validated by middleware)
 * Response: User data and JWT token on success
 *
 * @param {import('express').Request} req - Express request with validated body
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 *
 * @example
 * POST /api/auth/login
 * Body: { email: "john@example.com", password: "SecurePass123" }
 * Response: 200 { user: {...}, token: "eyJhbGc..." }
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.status(200).json({
            message: 'Login successful',
            user: result.user,
            token: result.token
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login
};
