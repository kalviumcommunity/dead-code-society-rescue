const User = require('../models/User');
const { sanitizeUser } = require('./authService');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Loads the authenticated user's profile.
 * @param {string} userId - User identifier from the auth middleware.
 * @returns {Promise<Object>} Sanitized user profile.
 * @throws {NotFoundError} If the user record does not exist.
 */
async function getProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return sanitizeUser(user);
}

module.exports = {
    getProfile: getProfile
};
