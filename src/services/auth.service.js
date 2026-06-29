const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Registers a new user.
 * @param {Object} userData - User information
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - Plaintext password
 * @param {string} [userData.role] - User's role
 * @returns {Promise<Object>} The saved User document
 * @throws {ConflictError} If email already exists
 */
const register = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new ConflictError('Email already taken');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = new User({
        ...userData,
        password: hashedPassword
    });

    return await user.save();
};

/**
 * Logins a user and issues a JWT token.
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{token: string, user: Object}>} Signed token and user details
 * @throws {NotFoundError} If user not found
 * @throws {UnauthorizedError} If password does not match
 */
const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError('No user found with that email');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new UnauthorizedError('Password does not match');
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

module.exports = {
    register,
    login
};
