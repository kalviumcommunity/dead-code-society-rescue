const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Registers a new user in the system after verifying that the email is unique.
 * Hashes the user password with bcrypt (12 rounds).
 *
 * @param {Object} userData - Registration payload details
 * @param {string} userData.name - User's display name
 * @param {string} userData.email - User's unique email address
 * @param {string} userData.password - User's plaintext password
 * @param {string} [userData.role] - User's role ('user' or 'admin')
 * @returns {Promise<Object>} Created User document
 * @throws {ConflictError} If email address is already registered
 */
const register = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new ConflictError('Email already registered');
    }
    
    const data = { ...userData };
    // Hash password using bcrypt with 12 rounds
    data.password = await bcrypt.hash(data.password, 12);
    const newUser = new User(data);
    return await newUser.save();
};

/**
 * Authenticates a user and returns a signed JWT.
 *
 * @param {string} email - User's email address
 * @param {string} password - Plaintext password to verify
 * @returns {Promise<{token: string, user: {name: string, email: string, role: string}}>} JWT token and user info
 * @throws {UnauthorizedError} If user is not found or password does not match
 */
const login = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }
    
    // Compare passwords using bcrypt.compare
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
};

/**
 * Retrieves a user profile by ID.
 *
 * @param {string} userId - User's database ObjectId
 * @returns {Promise<Object>} User document
 * @throws {NotFoundError} If no user exists with the given ID
 */
const getProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};

module.exports = {
    register,
    login,
    getProfile
};
