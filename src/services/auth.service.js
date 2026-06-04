const User = require('../models/User');
const { ConflictError, NotFoundError, UnauthorizedError } = require('../utils/errors.util');
const { comparePassword, hashPassword } = require('../utils/hash.util');
const { signAccessToken } = require('../utils/jwt.util');

function sanitizeUser(userDoc) {
    const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
    delete user.password;
    return user;
}

/**
 * Registers a new user and returns a JWT.
 * @param {{ name: string, email: string, password: string }} input - Registration payload.
 * @returns {Promise<{ user: object, token: string }>} Created user and JWT.
 * @throws {ConflictError} When the email already exists.
 */
async function registerUser(input) {
    const email = input.email.toLowerCase();
    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
        throw new ConflictError('Email already registered');
    }

    const password = await hashPassword(input.password);
    const createdUser = await User.create({
        email,
        name: input.name,
        password,
    });

    const token = signAccessToken({
        email: createdUser.email,
        id: createdUser._id.toString(),
        role: createdUser.role,
    });

    return {
        token,
        user: sanitizeUser(createdUser),
    };
}

/**
 * Authenticates a user by email and password.
 * @param {{ email: string, password: string }} input - Login payload.
 * @returns {Promise<{ user: object, token: string }>} Authenticated user and JWT.
 * @throws {NotFoundError} When the email does not match any user.
 * @throws {UnauthorizedError} When the password is invalid.
 */
async function loginUser(input) {
    const email = input.email.toLowerCase();
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new NotFoundError('User not found');
    }

    const isValid = await comparePassword(input.password, user.password);

    if (!isValid) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const token = signAccessToken({
        email: user.email,
        id: user._id.toString(),
        role: user.role,
    });

    return {
        token,
        user: sanitizeUser(user),
    };
}

/**
 * Loads the current user's profile.
 * @param {string} userId - MongoDB user identifier.
 * @returns {Promise<object>} Sanitized user profile.
 * @throws {NotFoundError} When no user exists for the supplied id.
 */
async function getProfile(userId) {
    const user = await User.findById(userId).lean();

    if (!user) {
        throw new NotFoundError('User not found');
    }

    delete user.password;
    return user;
}

module.exports = {
    getProfile,
    loginUser,
    registerUser,
};