const userService = require('../services/user.service');
const { sendOk } = require('../utils/response.util');

/**
 * Returns the profile for the authenticated user.
 *
 * @param {import('express').Request} req - Express request object with auth context.
 * @param {import('express').Response} res - Express response object used to send the profile.
 * @param {import('express').NextFunction} next - Express next callback for centralized error handling.
 * @returns {Promise<void>}
 * @throws {NotFoundError} If the user cannot be found.
 */
async function profile(req, res, next) {
    try {
        const user = await userService.getProfile(req.auth.userId);

        return sendOk(res, user);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    profile
};