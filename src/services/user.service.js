/**
 * User service
 * Handles user profile operations and queries
 */

const User = require('../../models/User.model');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Get a user's profile by their ID.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object>} User document (without password)
 * @throws {NotFoundError} If user does not exist
 *
 * @example
 * const user = await userService.getProfile('507f1f77bcf86cd799439011')
 */
const getProfile = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return user.toJSON();
};

/**
 * Get a user by email address.
 * Used for user lookups and verification.
 *
 * @param {string} email - User email address
 * @returns {Promise<Object|null>} User document or null if not found
 *
 * @example
 * const user = await userService.getUserByEmail('user@example.com')
 */
const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

/**
 * Get a user by ID.
 * Used internally by other services.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object|null>} User document or null if not found
 *
 * @example
 * const user = await userService.getUserById('507f1f77bcf86cd799439011')
 */
const getUserById = async (userId) => {
    return await User.findById(userId);
};

module.exports = {
    getProfile,
    getUserByEmail,
    getUserById
};
