const userService = require('../services/user.service');

/**
 * Gets the current user's profile
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.userId);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile
};
