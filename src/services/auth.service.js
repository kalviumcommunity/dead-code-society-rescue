const User = require('../models/User.model');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signAuthToken } = require('../utils/jwt.util');
const { NotFoundError, UnauthorizedError, ConflictError } = require('../utils/errors.util');

/**
 * Registers a new user with email and password.
 * @param {object} data - User registration data.
 * @param {string} data.name - User full name.
 * @param {string} data.email - User email address.
 * @param {string} data.password - Plaintext password.
 * @returns {Promise<object>} Created user object (without password).
 * @throws {ConflictError} If email already exists.
 */
const register = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  const hashedPassword = await hashPassword(data.password);
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: 'user',
  });

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

/**
 * Authenticates a user and returns a signed JWT.
 * @param {string} email - User email address.
 * @param {string} password - Plaintext password.
 * @returns {Promise<{user: object, token: string}>} Authenticated user and JWT token.
 * @throws {NotFoundError} If user not found.
 * @throws {UnauthorizedError} If password is incorrect.
 */
const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = signAuthToken({
    id: user._id.toString(),
    role: user.role,
  });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

/**
 * Retrieves a user by ID.
 * @param {string} userId - MongoDB user ID.
 * @returns {Promise<object>} User object (without password).
 * @throws {NotFoundError} If user not found.
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

module.exports = {
  register,
  login,
  getUserById,
};
