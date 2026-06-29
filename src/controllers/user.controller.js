// ADDED: User controller mapping profile request to user service.
const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/response.util');

/**
 * Get profile of the currently logged-in user.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next handler
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.userId);
    return sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile
};
