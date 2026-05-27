const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt.util');

/**
 * Register a new user
 * @param {Object} userData - User data including name, email, password
 * @returns {Promise<Object>} The created user object
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
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Object containing user data and JWT token
 * @throws {Error} If user not found or password doesn't match
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
 * @param {string} userId - User ID
 * @returns {Promise<Object>} The user object
 */
const getUserProfile = async (userId) => {
    return await User.findById(userId);
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
