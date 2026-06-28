const userService = require("../services/user.service");

/**
 * Get current user profile.
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