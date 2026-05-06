const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/response.util');

/**
 * Returns profile for authenticated user.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {Promise<void>}
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await userService.getProfile(req.userId);
    sendSuccess(res, 200, profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
};
