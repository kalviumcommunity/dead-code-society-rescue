const User = require('../models/User');
const { hashPassword, verifyPassword } = require('../utils/hash');
const { signToken } = require('../utils/token');
const { ConflictError, NotFoundError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Removes sensitive fields from a user document before it is returned to callers.
 * @param {Object} user - User document from MongoDB.
 * @returns {Object} Sanitized user object.
 */
function sanitizeUser(user) {
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
    };
}

/**
 * Registers a new user account.
 * @param {Object} payload - Registration fields from the request body.
 * @param {string} payload.name - User's display name.
 * @param {string} payload.email - User's email address.
 * @param {string} payload.password - Plaintext password to hash.
 * @returns {Promise<Object>} Sanitized user record.
 * @throws {ConflictError} If the email address already exists.
 */
async function registerUser(payload) {
    const passwordHash = await hashPassword(payload.password);

    const user = new User({
        name: payload.name,
        email: payload.email,
        password: passwordHash,
        role: 'user'
    });

    try {
        const savedUser = await user.save();
        return sanitizeUser(savedUser);
    } catch (error) {
        if (error && error.code === 11000) {
            throw new ConflictError('Email already exists');
        }

        throw error;
    }
}

/**
 * Authenticates a user and returns a signed JWT.
 * @param {Object} payload - Login fields from the request body.
 * @param {string} payload.email - User's email address.
 * @param {string} payload.password - Plaintext password to verify.
 * @returns {Promise<Object>} Authenticated user data and JWT.
 * @throws {UnauthorizedError} If credentials are invalid or the user is missing.
 */
async function loginUser(payload) {
    const user = await User.findOne({ email: payload.email }).select('+password');

    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await verifyPassword(payload.password, user.password);

    if (!isValid) {
        throw new UnauthorizedError('Invalid credentials');
    }

    return {
        token: signToken({
            id: String(user._id),
            role: user.role
        }),
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

module.exports = {
    registerUser: registerUser,
    loginUser: loginUser,
    sanitizeUser: sanitizeUser
};
