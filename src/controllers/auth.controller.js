const authService = require('../services/auth.service')

/**
 * Controller: Register a new user.
 * Handles POST /api/auth/register.
 * Body is already validated by Joi middleware.
 *
 * @param {Object} req - Express request object (body contains validated email, password, name)
 * @param {Object} res - Express response object
 * @param {Function} next - Express error handler
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body)
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: result
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Controller: Authenticate user and return JWT.
 * Handles POST /api/auth/login.
 * Body is already validated by Joi middleware.
 *
 * @param {Object} req - Express request object (body contains validated email, password)
 * @param {Object} res - Express response object
 * @param {Function} next - Express error handler
 */
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Controller: Get current authenticated user profile.
 * Handles GET /api/auth/profile.
 * Requires valid JWT token (authMiddleware already verified).
 *
 * @param {Object} req - Express request object (req.userId set by authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express error handler
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUser(req.userId)
    res.status(200).json({
      success: true,
      data: user
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  register,
  login,
  getProfile
}
