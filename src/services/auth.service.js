const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt.util');

/**
 * Register a new user
 * @param {Object} userData - User data including name, email, password, and optionally role
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address (must be unique)
 * @param {string} userData.password - User's password (will be hashed with bcrypt)
 * @param {string} [userData.role] - User's role (defaults to 'user')
 * @returns {Promise<Object>} The created user object with hashed password
 * @throws {Error} If email already exists or validation fails
 */
const registerUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const newUser = new User({
        ...userData,
        password: hashedPassword
    });
    return await newUser.save();
};

/**
 * Login a user and return a JWT token
 * @param {string} email - User's email address
 * @param {string} password - User's plaintext password
 * @returns {Promise<{msg: string, token: string, data: Object}>} Object containing success message, JWT token, and user data
 * @throws {Error} If no user exists with the given email
 * @throws {Error} If the password does not match
 */
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new Error('No user found with that email');
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Password does not match');
    }
    
    const token = generateToken({ id: user._id, role: user.role });
    
    return {
        msg: 'Login OK',
        token,
        data: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

/**
 * Get user profile by ID
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object>} The user object without password
 * @throws {Error} If user ID is invalid or user not found
 */
const getUserProfile = async (userId) => {
    return await User.findById(userId);
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
