const User = require('../models/User');
const hashingUtil = require('../utils/hashing.util');
const jwtUtil = require('../utils/jwt.util');
const { NotFoundError, UnauthorizedError, ConflictError } = require('../utils/errors.util');

/**
 * Registers a new user inside the database after hashing the password.
 * Checks for email duplication beforehand.
 * @param {Object} userData - Information for registration.
 * @param {string} userData.name - Display name of the user.
 * @param {string} userData.email - Unique email address of the user.
 * @param {string} userData.password - Plaintext password of the user.
 * @param {string} [userData.role] - Role designation ('user' or 'admin').
 * @returns {Promise<Object>} The registered User document.
 * @throws {ConflictError} If the email is already registered in the system.
 */
async function registerUser(userData) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
        throw new ConflictError('Email is already registered');
    }
    const data = { ...userData };
    data.password = await hashingUtil.hashPassword(data.password);
    const newUser = new User(data);
    return await newUser.save();
}

/**
 * Validates user credentials and produces a JSON Web Token.
 * @param {string} email - Email address input.
 * @param {string} password - Plaintext password input.
 * @returns {Promise<{token: string, user: {name: string, email: string, role: string}}>} Generated JWT token and core user profile data.
 * @throws {NotFoundError} If the email is not registered.
 * @throws {UnauthorizedError} If the password verification fails.
 */
async function loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError('No user found with that email');
    }
    const isValid = await hashingUtil.comparePassword(password, user.password);
    if (!isValid) {
        throw new UnauthorizedError('Password does not match');
    }
    const token = jwtUtil.signToken({ id: user._id, role: user.role });
    return {
        token: token,
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

/**
 * Retrieves the full user record using its database ID.
 * @param {string} userId - Mongoose ObjectID string.
 * @returns {Promise<Object>} The matching User database record.
 * @throws {NotFoundError} If the user profile could not be located.
 */
async function getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User profile not found');
    }
    return user;
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
