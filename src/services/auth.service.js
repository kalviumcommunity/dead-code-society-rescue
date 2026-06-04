const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');
const { sanitizeUser } = require('../utils/response.util');
const {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} = require('../utils/errors.util');

/**
 * Register a new user with bcrypt-hashed password.
 * @param {{ name: string, email: string, password: string }} data - Registration fields
 * @returns {Promise<{ user: Object, message: string }>} Created user (no password)
 * @throws {ConflictError} If email is already registered
 */
const register = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new ConflictError('Email is already registered');
  }

  const passwordHash = await hashPassword(data.password);
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: passwordHash,
  });

  return {
    message: 'Account created',
    user: sanitizeUser(user),
  };
};

/**
 * Authenticate user and return JWT.
 * @param {string} email - User email
 * @param {string} password - Plaintext password
 * @returns {Promise<{ token: string, user: Object }>} JWT and public user fields
 * @throws {NotFoundError} If no user exists with the email
 * @throws {UnauthorizedError} If password does not match
 */
const login = async (email, password) => {
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
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  register,
  login,
};
