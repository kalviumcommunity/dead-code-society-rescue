const User = require('../models/User');

/**
 * Gets current user's profile
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<Object>} User document
 * @throws {Error} If user not found
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = {
  getProfile
};
