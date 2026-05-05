const User = require('../models/User.model');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Retrieves a user profile by ID.
 * @param {string} userId - MongoDB user ID.
 * @returns {Promise<object>} User profile without password.
 * @throws {NotFoundError} If user is not found.
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new NotFoundError('User not found');
  }

  delete user.password;
  return user;
};

module.exports = {
  getProfile,
};
