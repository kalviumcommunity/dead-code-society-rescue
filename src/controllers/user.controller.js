const userService = require('../services/user.service');
const asyncHandler = require('../middlewares/async.middleware');

/**
 * Returns the current authenticated user's profile.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.userId);
  res.status(200).json({ success: true, data: user });
});

module.exports = {
  getProfile,
};
