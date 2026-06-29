// ADDED: Authentication service containing registration and login business logic.
const User = require('../models/User.model');
const { ConflictError, NotFoundError, UnauthorizedError } = require('../utils/errors.util');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');

/**
 * Register a new user in the system.
 *
 * @param {Object} userData - Registration payload
 * @param {string} userData.name - User full name
 * @param {string} userData.email - User email address
 * @param {string} userData.password - User plaintext password
 * @param {string} [userData.role] - User role ('user' or 'admin')
 * @returns {Promise<Object>} The newly created user document (excluding password)
 * @throws {ConflictError} If the email is already in use
 */
const register = async (userData) => {
  const emailExists = await User.exists({ email: userData.email });
  if (emailExists) {
    throw new ConflictError('Email already taken');
  }

  const hashedPassword = await hashPassword(userData.password);
  const newUser = await User.create({
    ...userData,
    password: hashedPassword
  });

  const userObj = newUser.toObject();
  delete userObj.password;
  return userObj;
};

/**
 * Authenticate a user and sign a JWT.
 *
 * @param {string} email - User email address
 * @param {string} password - User plaintext password
 * @returns {Promise<{token: string, data: {name: string, email: string, role: string}}>} JWT and user details
 * @throws {NotFoundError} If no user is found with the email
 * @throws {UnauthorizedError} If the password verification fails
 */
const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('No user found with that email');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Password does not match');
  }

  const token = signToken({ id: user._id, role: user.role });
  return {
    token,
    data: {
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
