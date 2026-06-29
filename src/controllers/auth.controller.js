const authService = require('../services/auth.service');
const asyncWrapper = require('../utils/asyncWrapper');
const { UnauthorizedError } = require('../utils/errors.util');

/**
 * Registers a new user.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response
 */
const register = asyncWrapper(async (req, res) => {
    const user = await authService.registerUser(req.body);
    console.log('Registered user: ' + user.email);
    res.status(201).json({
        success: true,
        message: 'Account created!',
        user: user
    });
});

/**
 * Logs in a user and returns a JWT.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response with JWT
 * @throws {UnauthorizedError} If login fails
 */
const login = asyncWrapper(async (req, res) => {
    const result = await authService.loginUser(req.body.email, req.body.password);
    if (result.error) {
        throw new UnauthorizedError(result.error);
    }
    res.json(result);
});

module.exports = {
    register,
    login
};
