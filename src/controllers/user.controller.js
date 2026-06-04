const userService = require('../services/user.service');

/**
 * Gets the current user's profile.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile
};
