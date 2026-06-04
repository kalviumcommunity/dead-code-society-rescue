const User = require('../models/User');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Get user profile.
 * @param {string} userId - ID of the user.
 * @returns {Promise<Object>} User object.
 * @throws {NotFoundError} If user not found.
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user.toJSON();
};

module.exports = { getProfile };
