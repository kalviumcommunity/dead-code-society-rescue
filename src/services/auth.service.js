const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');
const { NotFoundError, UnauthorizedError, ConflictError } = require('../utils/errors.util');

/**
 * Register a new user.
 * @param {Object} userData - The user data.
 * @param {string} userData.name - User's name.
 * @param {string} userData.email - User's email.
 * @param {string} userData.password - User's plaintext password.
 * @returns {Promise<Object>} The registered user object (without password).
 * @throws {ConflictError} If email is already registered.
 */
const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ConflictError('Email already registered');
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword });

  return user.toJSON();
};

/**
 * Authenticate a user and return a token.
 * @param {Object} credentials - Login credentials.
 * @param {string} credentials.email - User's email.
 * @param {string} credentials.password - User's plaintext password.
 * @returns {Promise<Object>} Object containing user and JWT token.
 * @throws {NotFoundError} If user not found.
 * @throws {UnauthorizedError} If invalid credentials.
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new NotFoundError('No user found with that email');
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = signToken({ id: user._id, role: user.role });

  return {
    user: user.toJSON(),
    token,
  };
};

module.exports = { register, login };
