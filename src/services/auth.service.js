const bcrypt = require('bcrypt');
const User = require('../models/User');
const { signToken } = require('../utils/jwt.util');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors.util');

const SALT_ROUNDS = 12;

/**
 * Registers a new user account.
 * Hashes the password with bcrypt before persisting.
 * Only whitelisted fields (name, email, password) are saved —
 * the role field is intentionally excluded to prevent privilege escalation.
 *
 * @param {{ name: string, email: string, password: string }} data - Validated registration payload
 * @returns {Promise<{ _id: string, name: string, email: string, role: string, createdAt: Date }>} Saved user (password excluded)
 * @throws {ConflictError} If a user with the given email already exists
 */
const register = async ({ name, email, password }) => {
    const existing = await User.findOne({ email });
    if (existing) {
        throw new ConflictError('An account with that email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({ name, email, password: hashedPassword });

    // Never return the password hash to the caller
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
};

/**
 * Authenticates a user and returns a signed JWT.
 * Uses a generic error message for both "not found" and "wrong password"
 * to avoid leaking information about which accounts exist.
 *
 * @param {string} email    - User's email address
 * @param {string} password - Plaintext password to verify
 * @returns {Promise<{ user: { name: string, email: string, role: string }, token: string }>}
 * @throws {UnauthorizedError} If credentials are invalid (deliberately vague)
 */
const login = async (email, password) => {
    const user = await User.findOne({ email });

    // Deliberate: same error for unknown email AND wrong password
    // to prevent account enumeration attacks
    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const token = signToken({ id: user._id, role: user.role });

    return {
        user: { name: user.name, email: user.email, role: user.role },
        token,
    };
};

/**
 * Retrieves a user profile by ID, excluding the password field.
 *
 * @param {string} userId - MongoDB ObjectId string
 * @returns {Promise<Object>} User document without password
 * @throws {NotFoundError} If no user exists with the given ID
 */
const getProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};

module.exports = { register, login, getProfile };
