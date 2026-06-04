const User = require('../models/User.model');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { generateToken } = require('../utils/jwt.util');
const { NotFoundError, UnauthorizedError, ConflictError } = require('../utils/errors.util');

/**
 * Registers a new user with bcrypt password hashing.
 * @param {Object} data - User registration data
 * @param {string} data.name - User's full name
 * @param {string} data.email - User's email address
 * @param {string} data.password - Plaintext password
 * @param {string} data.role - User role (optional, defaults to 'user')
 * @returns {Promise<Object>} The created user document
 * @throws {ConflictError} If email already exists
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
    role: data.role || 'user'
  });

  return user;
};

/**
 * Authenticates a user and returns a JWT token.
 * @param {string} email - User's email address
 * @param {string} password - Plaintext password
 * @param {string} jwtSecret - JWT secret key
 * @returns {Promise<{user: Object, token: string}>} User data and JWT token
 * @throws {NotFoundError} If no user exists with the given email
 * @throws {UnauthorizedError} If password does not match
 */
const login = async (email, password, jwtSecret) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('No user found with that email');
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = generateToken(
    { id: user._id, role: user.role },
    jwtSecret
  );

  return {
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};

module.exports = {
  register,
  login
};
