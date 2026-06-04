const User = require('../models/User');
const { sanitizeUser } = require('../utils/response.util');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Fetch profile for the authenticated user.
 * @param {string} userId - MongoDB user id
 * @returns {Promise<Object>} User profile without password
 * @throws {NotFoundError} If user does not exist
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return sanitizeUser(user);
};

module.exports = {
  getProfile,
};
