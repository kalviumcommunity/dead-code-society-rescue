const User = require('../models/User.model');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Gets a user by ID.
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object>} The user document
 * @throws {NotFoundError} If user does not exist
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

module.exports = {
  getUserById
};
