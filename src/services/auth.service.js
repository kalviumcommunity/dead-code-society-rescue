const User = require('../models/User.model');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');
const { ConflictError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Registers a new user account.
 * @param {{name: string, email: string, password: string, role?: string}} payload - User registration payload.
 * @returns {Promise<{id: string, name: string, email: string, role: string}>} Public user profile.
 * @throws {ConflictError} If email already exists.
 */
const register = async (payload) => {
  const existing = await User.findOne({ email: payload.email.toLowerCase() });
  if (existing) {
    throw new ConflictError('Email already exists');
  }

  const password = await hashPassword(payload.password);
  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password,
    role: payload.role || 'user',
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

/**
 * Authenticates a user and returns a JWT.
 * @param {{email: string, password: string}} payload - Login payload.
 * @returns {Promise<{token: string, user: {id: string, name: string, email: string, role: string}}>} Auth result.
 * @throws {UnauthorizedError} If credentials are invalid.
 */
const login = async (payload) => {
  const user = await User.findOne({ email: payload.email.toLowerCase() });
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const validPassword = await comparePassword(payload.password, user.password);
  if (!validPassword) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = signToken({ id: user._id.toString(), role: user.role });

  return {
    token,
    user: {
      id: user._id,
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
