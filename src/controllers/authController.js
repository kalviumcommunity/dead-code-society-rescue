const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Register a new user account.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({ success: true, message: 'Account created!', user });
});

/**
 * Log in a user and issue a JWT.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body.email, req.body.password);
  res.json(result);
});

/**
 * Return the profile for the authenticated user.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const getProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getUserProfile(req.user.id);
  res.json(profile);
});

module.exports = {
  register,
  login,
  getProfile
};
