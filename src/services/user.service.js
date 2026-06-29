const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UnauthorizedError, NotFoundError } = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Registers a new user in the database. Hashes the user's password using bcrypt.
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User plaintext password
 * @param {string} [userData.role] - User role ('user' or 'admin')
 * @returns {Promise<Object>} Newly created Mongoose User document
 */
async function registerUser(userData) {
    userData.password = await bcrypt.hash(userData.password, 12);
    const newUser = new User(userData);
    return await newUser.save();
}

/**
 * Authenticates a user and returns a signed JWT.
 * @param {string} email - User's email address
 * @param {string} password - Plaintext password to verify
 * @returns {Promise<{token: string, user: {name: string, email: string, role: string}}>} Authenticated user details and JWT token
 * @throws {UnauthorizedError} If no user exists with the given email or password comparison fails
 */
async function loginUser(email, password) {
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '12h' }
    );

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
 * Retrieves a user from the database by their unique ID.
 * @param {string} userId - Unique User identifier
 * @returns {Promise<Object>} Mongoose User document
 * @throws {NotFoundError} If the user with the given ID does not exist
 */
async function getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return user;
}

module.exports = {
    registerUser,
    loginUser,
    getUserById
};
