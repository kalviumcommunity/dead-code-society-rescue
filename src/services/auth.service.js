/**
 * @file auth.service.js
 * @description Authentication business logic layer
 */

const User = require('../models/User.model');
const { signToken } = require('../utils/jwt.util');
const { ConflictError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Register a new user
 * @param {Object} userData - Data for new user
 * @returns {Promise<{user: Object, token: string}>}
 * @throws {ConflictError} - If email already exists
 */
const register = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ConflictError('User with this email already exists.');
  }

  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });

  // Remove password from returned object
  newUser.password = undefined;

  const token = signToken(newUser._id);

  return { user: newUser, token };
};

/**
 * Log in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: Object, token: string}>}
 * @throws {UnauthorizedError} - If authentication fails
 */
const login = async (email, password) => {
  // Find user and explicitly select password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    throw new UnauthorizedError('Invalid email or password.');
  }

  // Remove password from returned object
  user.password = undefined;

  const token = signToken(user._id);

  return { user, token };
};

module.exports = {
  register,
  login,
};
