const authService = require('../services/auth.service');

/**
 * Registers a new user and returns the created profile.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * Authenticates a user and returns a JWT.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
const login = async (req, res, next) => {
  try {
    const token = await authService.login(req.body);
    res.json(token);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login
};
