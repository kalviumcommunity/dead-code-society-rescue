const User = require('../models/User.model');
const { NotFoundError } = require('../utils/errors.util');
const { toSafeUser } = require('../utils/user.util');

/**
 * Returns the authenticated user's profile.
 *
 * @param {string} userId - MongoDB user id.
 * @returns {Promise<Object>} Sanitized user profile.
 * @throws {NotFoundError} If the user does not exist.
 */
async function getProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return toSafeUser(user);
}

module.exports = {
    getProfile
};