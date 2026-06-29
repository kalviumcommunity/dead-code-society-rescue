// ADDED: User service to manage user profile and data retrieval.
const User = require('../models/User.model');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Retrieve a user's profile information by ID.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object>} The user profile details (excluding password)
 * @throws {NotFoundError} If the user does not exist
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new NotFoundError('User profile not found');
  }
  return user;
};

module.exports = {
  getUserProfile
};
