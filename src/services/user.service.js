const User = require('../models/User.model');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Gets a user by their MongoDB ObjectId.
 * @param {string} id - The user ID
 * @returns {Promise<Object>} The User document
 * @throws {NotFoundError} If the user does not exist
 */
const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};

module.exports = {
    getUserById
};
