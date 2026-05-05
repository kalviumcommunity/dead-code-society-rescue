const userService = require('../services/user.service');

/**
 * Returns the current authenticated user's profile.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.userId);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
};
