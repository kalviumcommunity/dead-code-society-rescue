const userService = require('../services/user.service');

/**
 * Retrieves the profile of the currently authenticated user.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 * @throws {NotFoundError} If user does not exist
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = { getProfile };
