const userService = require('../services/user.service');

/**
 * Return the current user's profile.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next handler.
 * @returns {Promise<void>} Sends a JSON response.
 * @throws {Error} Propagates unexpected service errors.
 */
const profile = async (req, res, next) => {
    // SMELL: [MEDIUM] Missing error handling can hide database failures from clients.
    try {
        const user = await userService.getProfile(req.userId);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    profile
};
