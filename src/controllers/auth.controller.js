const authService = require('../services/auth.service');

/**
 * POST /api/auth/register
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {Promise<void>}
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {Promise<void>}
 */
const login = async (req, res, next) => {
  try {
    const { token, user } = await authService.login(
      req.body.email,
      req.body.password
    );
    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};
