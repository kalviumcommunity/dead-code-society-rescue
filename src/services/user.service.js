const User = require('../models/User');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Retrieves the profile of a user by ID.
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} The user's profile
 * @throws {NotFoundError} If the user is not found
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password').lean();
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

module.exports = {
  getUserProfile
};