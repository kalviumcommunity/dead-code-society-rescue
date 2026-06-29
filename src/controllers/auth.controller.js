// ADDED: Auth controller mapping request data to auth service and returning token and user details.
const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response.util');

/**
 * Handle user registration request.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next handler
 */
const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return sendSuccess(res, {
      success: true,
      message: 'Account created!',
      user
    }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Handle user login request.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next handler
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return sendSuccess(res, {
      msg: 'Login OK',
      token: result.token,
      data: result.data
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login
};
