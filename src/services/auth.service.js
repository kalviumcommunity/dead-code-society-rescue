const User = require('../models/User.model');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors.util');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');
const { toSafeUser } = require('../utils/user.util');

/**
 * Creates a new user account.
 *
 * @param {{name: string, email: string, password: string}} data - Registration payload.
 * @returns {Promise<Object>} The created user without the password field.
 * @throws {ConflictError} If the email is already in use.
 */
async function registerUser(data) {
    const existingUser = await User.exists({ email: data.email });

    if (existingUser) {
        throw new ConflictError('Email already taken');
    }

    const password = await hashPassword(data.password);
    const user = await User.create({
        name: data.name,
        email: data.email,
        password,
        role: 'user'
    });

    return toSafeUser(user);
}

/**
 * Logs a user in and returns a JWT plus a safe user object.
 *
 * @param {{email: string, password: string}} credentials - Login credentials.
 * @returns {Promise<{token: string, user: Object}>} Token and sanitized user profile.
 * @throws {NotFoundError} If no user exists for the provided email.
 * @throws {UnauthorizedError} If the password does not match.
 */
async function loginUser(credentials) {
    const user = await User.findOne({ email: credentials.email }).select('+password');

    if (!user) {
        throw new NotFoundError('User not found');
    }

    const passwordMatches = await comparePassword(credentials.password, user.password);

    if (!passwordMatches) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const token = signToken({
        id: user._id.toString(),
        role: user.role
    });

    return {
        token,
        user: toSafeUser(user)
    };
}

module.exports = {
    registerUser,
    loginUser
};