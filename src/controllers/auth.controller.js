const authService = require('../services/auth.service');

/**
 * Registers a new user.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
async function register(req, res, next) {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ success: true, message: 'Account created', user });
  } catch (error) {
    next(error);
  }
}

/**
 * Authenticates a user and returns a JWT.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body.email, req.body.password);
    res.json({ success: true, message: 'Login OK', ...result });
  } catch (error) {
    next(error);
  }
}

/**
 * Returns the current user's profile.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
async function profile(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  profile
};
