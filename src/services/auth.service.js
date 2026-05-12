const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { generateToken } = require('../utils/jwt.util');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors.util');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} [userData.role='user'] - User role
 * @returns {Promise<Object>} Created user data
 * @throws {ConflictError} If email already exists
 */
const register = async (userData) => {
  const { name, email, password, role = 'user' } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  // Return user without password
  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

/**
 * Authenticate user login
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Login response with token and user data
 * @throws {UnauthorizedError} If credentials are invalid
 */
const login = async (credentials) => {
  const { email, password } = credentials;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate token
  const token = generateToken({
    id: user._id,
    role: user.role
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data
 * @throws {NotFoundError} If user not found
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

module.exports = {
  register,
  login,
  getProfile
};