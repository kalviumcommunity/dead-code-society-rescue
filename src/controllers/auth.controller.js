const authService = require('../services/auth.service');
const asyncHandler = require('../middlewares/async.middleware');

/**
 * Registers a new user.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({ success: true, data: user });
});

/**
 * Logs in a user and returns a JWT token.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  res.status(200).json({ success: true, data: result });
});

/**
 * Retrieves the current user profile.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.userId);
  res.status(200).json({ success: true, data: user });
});

module.exports = {
  register,
  login,
  getProfile,
};
