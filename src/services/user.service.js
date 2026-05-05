const User = require('../models/User');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Gets the current user's profile by ID
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<Object>} User document
 * @throws {NotFoundError} If user not found
 *
 * @example
 * const user = await getProfile('507f1f77bcf86cd799439011');
 * console.log(user.email); // user@example.com
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

module.exports = {
  getProfile
};
