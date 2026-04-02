/**
 * @file auth.controller.js
 * @description Controllers for authentication related operations
 */

const authService = require('../services/auth.service');

/**
 * Handle user registration
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 */
const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);

    res.status(201).json({
      status: 'success',
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle user login
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    res.status(200).json({
      status: 'success',
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};
