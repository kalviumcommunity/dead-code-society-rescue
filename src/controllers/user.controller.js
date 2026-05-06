/**
 * User controller
 * Thin layer that handles user profile requests
 * Delegates business logic to userService
 */

const userService = require('../services/user.service');

/**
 * Get current authenticated user's profile.
 * User ID comes from JWT token (set by auth middleware).
 *
 * @param {import('express').Request} req - Express request (req.userId set by middleware)
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 *
 * @example
 * GET /api/users/profile
 * Headers: Authorization: <token>
 * Response: 200 { name: "John", email: "john@example.com", role: "user" }
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.userId);

        res.status(200).json({
            message: 'Profile retrieved successfully',
            user
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProfile
};
