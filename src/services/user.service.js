const User = require('../models/User.model');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Retrieves the profile of a user by their ID.
 * The password field is excluded from the result via the model's toJSON transform.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object>} The user document (without password)
 * @throws {NotFoundError} If no user exists with the given ID
 */
const getUserProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};

module.exports = { getUserProfile };
