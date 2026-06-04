const userService = require('../services/user.service');

/**
 * Handles retrieving the current user's profile.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Promise<void>}
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile
};