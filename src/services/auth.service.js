const User = require('../../models/User');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signAuthToken } = require('../utils/jwt.util');
const { UnauthorizedError, ConflictError } = require('../utils/errors.util');

/**
 * Register a new user account.
 * @param {Object} data - User registration data
 * @param {string} data.name - User's full name
 * @param {string} data.email - User's email (unique)
 * @param {string} data.password - User's plaintext password
 * @returns {Promise<{user: Object, token: string}>} New user and JWT token
 * @throws {ConflictError} If email already registered
 *
 * @example
 * const result = await authService.register({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123'
 * })
 */
const register = async (data) => {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
        throw new ConflictError('Email already registered');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'user'
    });

    const token = signAuthToken({
        id: user._id,
        role: user.role
    });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
};

/**
 * Login user with email and password.
 * @param {string} email - User's email
 * @param {string} password - User's plaintext password
 * @returns {Promise<{user: Object, token: string}>} Authenticated user and JWT token
 * @throws {UnauthorizedError} If credentials are invalid
 *
 * @example
 * const result = await authService.login('john@example.com', 'SecurePass123')
 */
const login = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const token = signAuthToken({
        id: user._id,
        role: user.role
    });

    return {
        user: {
            id: user._id,
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
