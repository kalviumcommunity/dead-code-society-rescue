const User = require('../models/User.model');
const { NotFoundError } = require('../utils/errors.util');
const { toPublicUser } = require('./auth.service');

/**
 * Returns the authenticated user's profile.
 * @param {string} userId - MongoDB user id.
 * @returns {Promise<object>} User profile without password.
 * @throws {NotFoundError} If the user does not exist.
 * @throws {Error} If the database query fails.
 */
const getProfile = async function(userId) {
    const user = await User.findById(userId);

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return toPublicUser(user);
};

module.exports = {
    getProfile
};