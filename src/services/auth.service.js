const User = require('../models/User.model');
const { ConflictError, UnauthorizedError } = require('../utils/errors.util');
const { comparePassword, hashPassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');

/**
 * Removes sensitive fields from a user document.
 * @param {object} user - Mongoose user document or plain object.
 * @returns {object} Sanitised user data.
 * @throws {Error} If the user object cannot be converted.
 */
const toPublicUser = function(user) {
    const publicUser = typeof user.toObject === 'function' ? user.toObject() : { ...user };
    delete publicUser.password;
    return publicUser;
};

/**
 * Registers a new user.
 * @param {object} data - Registration payload.
 * @param {string} data.name - User name.
 * @param {string} data.email - User email.
 * @param {string} data.password - Plaintext password.
 * @param {string} [data.role] - Optional role.
 * @returns {Promise<{user: object, token: string}>} Created user and JWT.
 * @throws {ConflictError} If the email already exists.
 * @throws {Error} If password hashing or persistence fails.
 */
const register = async function(data) {
    const existingUser = await User.exists({ email: data.email });

    if (existingUser) {
        throw new ConflictError('Email already taken');
    }

    const password = await hashPassword(data.password);
    const user = await User.create({
        ...data,
        password
    });

    return {
        user: toPublicUser(user),
        token: signToken({ id: user._id.toString(), role: user.role })
    };
};

/**
 * Authenticates a user with email and password.
 * @param {string} email - User email.
 * @param {string} password - Plaintext password.
 * @returns {Promise<{user: object, token: string}>} Authenticated user and JWT.
 * @throws {UnauthorizedError} If the credentials are invalid.
 * @throws {Error} If the database or token signing fails.
 */
const login = async function(email, password) {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
        throw new UnauthorizedError('Invalid credentials');
    }

    return {
        user: toPublicUser(user),
        token: signToken({ id: user._id.toString(), role: user.role })
    };
};

module.exports = {
    register,
    login,
    toPublicUser
};