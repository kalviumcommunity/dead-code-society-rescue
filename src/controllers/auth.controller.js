const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response.util');

/**
 * Handles user registration request.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {Promise<void>}
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    sendSuccess(res, 201, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles user login request.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {Promise<void>}
 */
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, 200, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
