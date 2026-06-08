const userService = require('../services/user.service');
const asyncHandler = require('../middlewares/async-handler.middleware');

/**
 * Get current user profile.
 * GET /api/users/profile
 */
const getProfile = asyncHandler(async (req, res) => {
    const user = await userService.getProfile(req.auth.userId);
    res.status(200).json({
        success: true,
        data: user
    });
});

module.exports = {
    getProfile
};
