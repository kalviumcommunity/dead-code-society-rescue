/**
 * User controller - handles user profile routes
 */

const userService = require('../services/user.service');

/**
 * Get current user's profile
 * @param {Object} req - Express request object (must have userId from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.userId);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile
};
