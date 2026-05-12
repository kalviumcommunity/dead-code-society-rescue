const { asyncHandler } = require("../utils/async.util");
const userService = require("../services/user.service");

/**
 * Returns the authenticated user's profile.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the profile response.
 */
const profile = asyncHandler(async function profile(req, res) {
  const user = await userService.getUserProfile(req.user.id);
  res.json(user);
});

module.exports = {
  profile,
};
