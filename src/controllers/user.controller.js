const userService = require('../services/user.service');

/**
 * GET /api/users/profile
 * Returns the profile of the currently authenticated user.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserProfile(req.user.id);
        res.status(200).json({ data: user });
    } catch (err) {
        next(err);
    }
};

module.exports = { getProfile };
