const User = require('../../models/User');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Fetch user profile by ID.
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<Object>} User object
 * @throws {NotFoundError} If user not found
 *
 * @example
 * const user = await userService.getProfile('60d5ec49c1234567890abcde')
 */
const getProfile = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
    };
};

module.exports = {
    getProfile
};
