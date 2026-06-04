const authService = require('../services/auth.service');

/**
 * Registers a new user and returns the created account plus JWT.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the new user and token.
 * @throws {ConflictError|ValidationError|UnauthorizedError} If registration fails.
 */
const register = async function(req, res) {
    const result = await authService.register(req.body);
    res.status(201).json(result);
};

/**
 * Authenticates a user and returns a JWT.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the signed token.
 * @throws {UnauthorizedError|ValidationError} If credentials are invalid.
 */
const login = async function(req, res) {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
};

module.exports = {
    register,
    login
};