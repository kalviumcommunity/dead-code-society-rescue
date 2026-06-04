const userService = require('../services/user.service');

/**
 * Returns the current authenticated user's profile.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends the current user profile.
 * @throws {NotFoundError} If the user profile does not exist.
 */
const getProfile = async function(req, res) {
    const user = await userService.getProfile(req.user.id);
    res.json(user);
};

module.exports = {
    getProfile
};