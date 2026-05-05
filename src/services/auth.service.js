const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');
const { ConflictError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Registers a new user in the application.
 * @param {Object} userPayload - User registration payload.
 * @param {string} userPayload.name - User name.
 * @param {string} userPayload.email - User email.
 * @param {string} userPayload.password - Plaintext password.
 * @returns {Promise<Object>} Created user profile.
 * @throws {ConflictError} When the email is already registered.
 */
const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ConflictError('Email is already registered');
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
};

/**
 * Logs in a user and returns a JWT.
 * @param {Object} credentials - Login credentials.
 * @param {string} credentials.email - User email.
 * @param {string} credentials.password - Plaintext password.
 * @returns {Promise<Object>} Authentication result.
 * @throws {UnauthorizedError} When credentials are invalid.
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = signToken({ id: user.id, role: user.role });

  return {
    msg: 'Login OK',
    token,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

module.exports = {
  register,
  login
};
