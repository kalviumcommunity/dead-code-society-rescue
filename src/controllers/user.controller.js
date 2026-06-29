const userService = require('../services/user.service');

/**
 * Handles fetching the current user profile.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.userId);
        const userObj = user.toObject();
        delete userObj.password; // Do not leak the password hash in the response
        res.status(200).json(userObj);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProfile
};
