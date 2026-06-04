/**
 * User service - contains all business logic for user operations
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ServerError
} = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Register a new user with email and password
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - Plaintext password
 * @returns {Promise<Object>} Created user object (without password)
 * @throws {ConflictError} If email already registered
 * @throws {ServerError} If database operation fails
 */
const register = async (name, email, password) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError(`User with email ${email} already exists`);
    }

    // Hash password with bcrypt (12 rounds)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create and save new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  } catch (error) {
    if (error instanceof ConflictError) throw error;
    throw new ServerError(`Failed to register user: ${error.message}`);
  }
};

/**
 * Authenticate user and return JWT token
 * @param {string} email - User's email address
 * @param {string} password - Plaintext password to verify
 * @returns {Promise<Object>} User object and signed JWT token
 * @throws {NotFoundError} If no user exists with the given email
 * @throws {UnauthorizedError} If the password does not match
 */
const login = async (email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError(`No user found with email: ${email}`);
    }

    // Compare passwords using bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Return user (without password) and token
    const userObj = user.toObject();
    delete userObj.password;

    return {
      user: userObj,
      token
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
      throw error;
    }
    throw new ServerError(`Login failed: ${error.message}`);
  }
};

/**
 * Get user profile by ID
 * @param {string} userId - User's MongoDB ID
 * @returns {Promise<Object>} User object (without password)
 * @throws {NotFoundError} If user does not exist
 */
const getProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new ServerError(`Failed to fetch user: ${error.message}`);
  }
};

module.exports = {
  register,
  login,
  getProfile
};
