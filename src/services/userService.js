const User = require('../models/User');
const auth = require('../utils/auth');

/**
 * Register a new user
 * Validates and hashes password, saves to database
 */
exports.registerUser = async (userData) => {
    // Validate required fields
    if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Email, password, and name are required');
    }

    // Hash password
    userData.password = auth.hashPassword(userData.password);

    const newUser = new User(userData);
    const user = await newUser.save();
    return user;
};

/**
 * Login user
 * Find user by email, verify password, return user if valid
 */
exports.loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('No user found with that email');
    }

    // Verify password
    if (!auth.verifyPassword(password, user.password)) {
        throw new Error('Password does not match');
    }

    return user;
};

/**
 * Get user profile by ID
 */
exports.getUserProfile = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};
