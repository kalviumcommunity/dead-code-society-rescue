/**
 * User Service - All user business logic
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { UnauthorizedError, ConflictError, NotFoundError } = require('../utils/errors.util');
const { TOKEN_EXPIRY } = require('../utils/constants.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Register a new user
 * @param {Object} userData - User data (name, email, password)
 * @returns {Promise<Object>} Created user (without password)
 * @throws {ConflictError} If email already exists
 */
const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ConflictError('Email already registered');
  }

  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: role || 'user'
  });

  await user.save();

  // Return user without password
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

/**
 * Login user and return JWT token
 * @param {string} email - User email
 * @param {string} password - Plaintext password
 * @returns {Promise<{user: Object, token: string}>} User data and JWT token
 * @throws {NotFoundError} If no user with email exists
 * @throws {UnauthorizedError} If password does not match
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError('No user found with that email');
  }

  // Compare password with bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  const userObject = user.toObject();
  delete userObject.password;

  return {
    user: userObject,
    token
  };
};

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data (without password)
 * @throws {NotFoundError} If user not found
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
