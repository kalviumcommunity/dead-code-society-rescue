const userService = require('../services/user.service');
const asyncWrapper = require('../utils/asyncWrapper');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Retrieves the profile of the currently authenticated user.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response with user profile
 * @throws {NotFoundError} If user is not found
 */
const getProfile = asyncWrapper(async (req, res) => {
    const user = await userService.getUserById(req.userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    res.json(user);
});

module.exports = {
    getProfile
};
