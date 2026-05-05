const userService = require('../services/user.service');

/**
 * Returns the current authenticated user's profile.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile
};
