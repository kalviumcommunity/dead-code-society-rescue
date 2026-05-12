const User = require('../models/User');
const auth = require('../utils/auth');
const queryDebug = require('../utils/queryDebug');

/**
 * Register a new user
 * Validates and hashes password with bcrypt, saves to database
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - Plaintext password to hash
 * @param {string} userData.name - User's full name
 * @returns {Promise<Object>} Newly created user document with hashed password
 * @throws {Error} If email, password, or name is missing
 */
exports.registerUser = async (userData) => {
    // Validate required fields
    if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Email, password, and name are required');
    }

    // Hash password with bcrypt (12 rounds)
    userData.password = await auth.hashPassword(userData.password);

    const newUser = new User(userData);
    queryDebug.logQuery('INSERT', 'User', { email: userData.email });
    const user = await newUser.save();
    return user;
};

/**
 * Login user
 * Find user by email and verify password with bcrypt
 * @param {string} email - User's email address
 * @param {string} password - Plaintext password to verify
 * @returns {Promise<Object>} User document with matching email and password
 * @throws {Error} If user not found with given email
 * @throws {Error} If password does not match stored hash
 */
exports.loginUser = async (email, password) => {
    queryDebug.logQuery('FINDONE', 'User', { email });
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('No user found with that email');
    }

    // Verify password with bcrypt
    const isValid = await auth.verifyPassword(password, user.password);
    if (!isValid) {
        throw new Error('Password does not match');
    }

    return user;
};

/**
 * Get user profile by ID
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<Object>} User document with profile information
 * @throws {Error} If user with given ID does not exist
 */
exports.getUserProfile = async (userId) => {
    queryDebug.logQuery('FINDBYID', 'User', { _id: userId });
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};
