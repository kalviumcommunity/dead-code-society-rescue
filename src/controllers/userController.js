const userService = require('../services/userService');
const { sendJson } = require('../utils/response');

/**
 * Returns the authenticated user's profile.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the profile response.
 * @throws {Error} Any service error is forwarded to the error handler.
 */
async function profile(req, res, next) {
    const user = await userService.getProfile(req.user.id);
    return sendJson(res, 200, user);
}

module.exports = {
    profile: profile
};
