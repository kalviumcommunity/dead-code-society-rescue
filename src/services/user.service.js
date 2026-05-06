const User = require('../models/User.model');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Fetches the currently authenticated user's profile.
 * @param {string} userId - Authenticated user ID.
 * @returns {Promise<{id: string, name: string, email: string, role: string}>} Public user profile.
 * @throws {NotFoundError} If user does not exist.
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId).select('name email role');
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

module.exports = {
  getProfile,
};
