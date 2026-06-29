const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Register a new user with a hashed password.
 * @param {Object} userData User payload from the request body.
 * @returns {Promise<Object>} Newly created user document.
 */
async function registerUser(userData) {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);
  const user = await User.create({ ...userData, password: passwordHash });
  return user;
}

/**
 * Authenticate a user and issue a signed JWT.
 * @param {string} email User email address.
 * @param {string} password Plain-text password.
 * @returns {Promise<Object>} Authentication payload.
 */
async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid credentials');
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '12h' });

  return {
    success: true,
    msg: 'Login OK',
    token,
    data: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

/**
 * Fetch the current user profile without the password field.
 * @param {string} userId User id from the JWT payload.
 * @returns {Promise<Object>} User document.
 */
async function getUserProfile(userId) {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
