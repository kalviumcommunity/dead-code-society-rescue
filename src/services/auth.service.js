const User = require('../models/User.model');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors.util');

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

/**
 * Creates a new user with a bcrypt-hashed password.
 * @param {Object} data - Registration payload.
 * @param {string} data.name - User name.
 * @param {string} data.email - User email.
 * @param {string} data.password - Plaintext password.
 * @param {string} [data.role] - Optional role.
 * @returns {Promise<{id: string, name: string, email: string, role: string}>} Public user object.
 * @throws {ConflictError} When the email already exists.
 */
async function registerUser(data) {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  const hashedPassword = await hashPassword(data.password);
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || 'user'
  });

  return toPublicUser(user);
}

/**
 * Authenticates a user and returns a JWT plus public profile.
 * @param {string} email - User email.
 * @param {string} password - Plaintext password.
 * @returns {Promise<{token: string, user: {id: string, name: string, email: string, role: string}}>} Auth result.
 * @throws {UnauthorizedError} When credentials are invalid.
 */
async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = signToken({ id: user._id, role: user.role });

  return {
    token,
    user: toPublicUser(user)
  };
}

/**
 * Fetches the current user profile by id.
 * @param {string} userId - User id.
 * @returns {Promise<{id: string, name: string, email: string, role: string}>} Public user object.
 * @throws {NotFoundError} When the user does not exist.
 */
async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return toPublicUser(user);
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};
