const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Registers a new user.
 * @param {Object} data - User input data
 * @returns {Promise<Object>} Created user
 * @throws {ConflictError} If email already exists
 */
const register = async (data) => {
  const exists = await User.exists({ email: data.email });
  if (exists) {
    throw new ConflictError('Email already registered');
  }

  const hash = await bcrypt.hash(data.password, 12);
  const user = await User.create({ ...data, password: hash });
  
  const userObject = user.toObject();
  delete userObject.password;
  
  return userObject;
};

/**
 * Authenticates a user.
 * @param {string} email - Email address
 * @param {string} password - Plain text password
 * @returns {Promise<{token: string, data: Object}>} JWT and user data
 * @throws {NotFoundError} If user does not exist
 * @throws {UnauthorizedError} If password is incorrect
 */
const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('No user found with that email');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new UnauthorizedError('Password does not match');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  return {
    token,
    data: { name: user.name, email: user.email, role: user.role }
  };
};

module.exports = { register, login };
