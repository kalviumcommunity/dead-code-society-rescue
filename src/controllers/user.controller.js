const userService = require('../services/user.service');

/**
 * Handles fetching the current user's profile.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.userId);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = { getProfile };
