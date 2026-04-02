/**
 * @file user.service.js
 * @description User business logic layer
 */

const User = require('../models/User.model');
const { NotFoundError } = require('../utils/errors.util');

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>}
 * @throws {NotFoundError} - If user not found
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User profile not found.');
  }
  return user;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>}
 * @throws {NotFoundError} - If user not found
 */
const updateProfile = async (userId, updateData) => {
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new NotFoundError('User profile not found.');
  }

  return updatedUser;
};

module.exports = {
  getProfile,
  updateProfile,
};
