const User = require('../../models/User');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Fetches user details by ID, excluding sensitive data like passwords.
 * @param {string} userId - The unique identifier of the user
 * @returns {Promise<Object>} User document without password field
 * @throws {NotFoundError} If the user does not exist in the database
 */
const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new NotFoundError('User not found');
    return user;
};

module.exports = { getUserById };
