const User = require('../models/User');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Returns the profile for the given user id.
 * @param {string} userId - Authenticated user id.
 * @returns {Promise<Object>} User profile excluding password.
 * @throws {NotFoundError} When the user cannot be found.
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

module.exports = {
  getProfile
};
