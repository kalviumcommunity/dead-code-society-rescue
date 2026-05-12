const User = require('../models/User');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Get all users (admin only)
 * @returns {Promise<Array>} List of users
 */
const getAllUsers = async () => {
  const users = await User.find({}, '-password').sort({ createdAt: -1 });
  return users;
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 * @throws {NotFoundError} If user not found
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId, '-password');
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user
 * @throws {NotFoundError} If user not found
 */
const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * Delete user
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 * @throws {NotFoundError} If user not found
 */
const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};