const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Registers a new user.
 * 
 * @param {Object} userData - Data for the new user
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's plaintext password
 * @returns {Promise<Object>} The created user document
 */
const register = async (userData) => {
    const data = { ...userData };
    const saltRounds = 12;
    data.password = await bcrypt.hash(data.password, saltRounds);
    const newUser = new User(data);
    return await newUser.save();
};

/**
 * Authenticates a user and returns a signed JWT.
 * 
 * @param {string} email - User's email address
 * @param {string} password - Plaintext password to verify
 * @returns {Promise<{msg?: string, token?: string, data?: Object, error?: string}>} Authenticated user data and JWT or an error object
 */
const login = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        return { error: 'No user found with that email' };
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '12h' }
        );
        return {
            msg: 'Login OK',
            token: token,
            data: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    } else {
        return { error: 'Password does not match' };
    }
};

module.exports = { register, login };
