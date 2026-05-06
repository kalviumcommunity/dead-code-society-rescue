const User = require('../models/User.model');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');
const { NotFoundError, UnauthorizedError, ConflictError } = require('../utils/errors.util');

/**
 * Registers a new user account.
 * Hashes the password with bcrypt (12 rounds) before persisting.
 *
 * @param {Object} data - Validated registration payload
 * @param {string} data.name - User's full name
 * @param {string} data.email - User's email address
 * @param {string} data.password - Plaintext password (will be hashed)
 * @returns {Promise<Object>} The created user document (password excluded via toJSON)
 * @throws {ConflictError} If the email address is already registered
 */
const register = async (data) => {
    const exists = await User.exists({ email: data.email });
    if (exists) {
        throw new ConflictError('Email address is already registered');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await User.create({ ...data, password: hashedPassword });
    return user;
};

/**
 * Authenticates a user and returns a signed JWT.
 *
 * @param {string} email - User's email address
 * @param {string} password - Plaintext password to verify
 * @returns {Promise<{user: Object, token: string}>} Authenticated user object and JWT
 * @throws {NotFoundError} If no user exists with the given email
 * @throws {UnauthorizedError} If the password does not match the stored hash
 */
const login = async (email, password) => {
    // Fetch user including password field (excluded by default via toJSON)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new NotFoundError('No account found with that email address');
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const token = signToken({ id: user._id, role: user.role });

    // Return user without password
    const userObj = user.toJSON();
    return { user: userObj, token };
};

module.exports = { register, login };
