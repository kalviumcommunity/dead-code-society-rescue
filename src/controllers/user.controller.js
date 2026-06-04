const userService = require('../services/user.service');

/**
 * GET /api/profile
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {Promise<void>}
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.userId);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
};
