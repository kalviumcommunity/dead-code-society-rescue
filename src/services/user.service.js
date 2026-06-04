const User = require('../models/User.model');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');

/**
 * Register a new user in the system.
 * 
 * @param {Object} userData - The user registration data.
 * @param {string} userData.email - User email.
 * @param {string} userData.password - Plaintext password.
 * @param {string} userData.name - User full name.
 * @returns {Promise<Object>} The created user document.
 * @throws {Error} If email is already registered.
 */
const registerUser = async (userData) => {
    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    const user = new User({
        ...userData,
        password: hashedPassword
    });

    await user.save();
    return user;
};

/**
 * Authenticate a user by email and password.
 * 
 * @param {string} email - User email address.
 * @param {string} password - User plaintext password.
 * @returns {Promise<{token: string, user: Object}>} The signed JWT and safe user data.
 * @throws {Error} If authentication fails.
 */
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('No user found with that email');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Password does not match');
    }

    const token = signToken({ id: user._id, role: user.role });
    
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
 * Fetch a user by their MongoDB ID.
 * 
 * @param {string} id - The MongoDB ObjectId of the user.
 * @returns {Promise<Object>} The user document.
 * @throws {Error} If user not found.
 */
const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

module.exports = {
    registerUser,
    loginUser,
    getUserById
};
