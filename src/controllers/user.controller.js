const userService = require("../services/user.service");

/**
 * Handles GET /api/users/profile. Returns the authenticated user's profile.
 * @param {import('express').Request} req - Express request; req.user is set by the auth middleware
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function, used to forward errors
 * @returns {Promise<void>}
 */
const profile = async (req, res, next) => {
    try {
        const user = await userService.profile(req.user.id);

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    profile
};