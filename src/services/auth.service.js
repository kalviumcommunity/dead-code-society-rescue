const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UnauthorizedError, ConflictError } = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Registers a new user with bcrypt password hashing.
 * @param {Object} userData - The user registration data
 * @returns {Promise<Object>} The created user without the password
 * @throws {ConflictError} If a user with the given email already exists
 */
const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  const newUser = new User({
    ...userData,
    password: hashedPassword
  });

  const savedUser = await newUser.save();
  const userResponse = savedUser.toObject();
  delete userResponse.password;
  
  return userResponse;
};

/**
 * Authenticates a user and returns a signed JWT.
 * @param {string} email - User's email address
 * @param {string} password - Plaintext password to verify
 * @returns {Promise<Object>} Authenticated user and JWT
 * @throws {UnauthorizedError} If the credentials are invalid
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

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

module.exports = {
  registerUser,
  loginUser
};