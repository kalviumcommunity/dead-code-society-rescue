const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Registers a new user with a hashed password.
 * 
 * @param {Object} userData - User registration details
 * @param {string} userData.name - Full name of the user
 * @param {string} userData.email - Unique email address of the user
 * @param {string} userData.password - Plaintext password of the user
 * @param {string} [userData.role] - Account role (default: 'user')
 * @returns {Promise<import('mongoose').Document>} Resolves to the created Mongoose User document
 * @throws {Error} Throws error on database unique constraint failure or save errors
 */
const register = async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
};

/**
 * Authenticates user credentials and generates a signed JWT.
 * 
 * @param {string} email - Plaintext email address
 * @param {string} password - Plaintext password
 * @returns {Promise<{token: string, user: {name: string, email: string, role: string}}>} Resolves to login payload containing token and user profile
 * @throws {UnauthorizedError} Throws if user is not found or password doesn't match
 */
const login = async (email, password) => {
    const user = await User.findOne({ email });
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
        token,
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

/**
 * Retrieves the profile of a user by their ID.
 * 
 * @param {string} userId - Unique Mongoose ObjectId string of the user
 * @returns {Promise<import('mongoose').Document>} Resolves to the Mongoose User document
 * @throws {UnauthorizedError} Throws if the user does not exist
 */
const getProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new UnauthorizedError('User not found');
    }
    return user;
};

module.exports = {
    register,
    login,
    getProfile
};
