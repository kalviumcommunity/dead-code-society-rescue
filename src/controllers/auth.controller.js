const authService = require('../services/auth.service');

/**
 * Handles user registration.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Account created!',
      user
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handles user login.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const jwtSecret = process.env.JWT_SECRET || 'secret123';
    const result = await authService.login(email, password, jwtSecret);
    res.json({
      msg: 'Login OK',
      ...result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login
};
