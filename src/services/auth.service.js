/**
 * Authentication service
 * Handles user registration and login with secure password hashing and JWT tokens
 */

const User = require('../../models/User.model');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');
const { ConflictError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Register a new user with email, password, and name.
 * Hashes password using bcrypt (NOT MD5), checks for duplicate email.
 *
 * @param {Object} data - User registration data
 * @param {string} data.email - User email address
 * @param {string} data.password - Plaintext password to hash
 * @param {string} data.name - User's full name
 * @returns {Promise<Object>} Created user document (without password)
 * @throws {ConflictError} If email already exists
 * @throws {Error} If database operation fails
 *
 * @example
 * const user = await authService.register({
 *   email: 'user@example.com',
 *   password: 'SecurePass123',
 *   name: 'John Doe'
 * })
 */
const register = async (data) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        throw new ConflictError('Email already registered');
    }

    // Hash password using bcrypt with 12 salt rounds (CRITICAL fix from AUDIT)
    const hashedPassword = await hashPassword(data.password);

    // Create and save new user
    const user = new User({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'user' // Default role
    });

    await user.save();

    // Return user without password field
    return user.toJSON();
};

/**
 * Authenticate user by email and password, return JWT token.
 * Compares plaintext password against bcrypt hash (never plain comparison).
 *
 * @param {string} email - User email address
 * @param {string} password - Plaintext password to verify
 * @returns {Promise<Object>} User data and JWT token
 * @throws {UnauthorizedError} If user not found or password incorrect
 * @throws {Error} If database operation fails
 *
 * @example
 * const result = await authService.login('user@example.com', 'SecurePass123')
 * console.log(result.token) // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
const login = async (email, password) => {
    // Find user and explicitly select password field (it's excluded by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    // Use bcrypt.compare() - NEVER do direct string comparison (CRITICAL fix)
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
    }

    // Generate JWT token with user ID and role
    const token = signToken({
        id: user._id,
        role: user.role
    });

    return {
        user: user.toJSON(),
        token
    };
};

module.exports = {
    register,
    login
};
