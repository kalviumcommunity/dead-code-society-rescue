const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UnauthorizedError, NotFoundError } = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Registers a new user.
 * 
 * @param {Object} userData - The user details.
 * @param {string} userData.email - The email of the user.
 * @param {string} userData.password - The plaintext password.
 * @param {string} userData.name - The name of the user.
 * @param {string} [userData.role] - The role of the user.
 * @returns {Promise<Object>} The created user document.
 */
const registerUser = async (userData) => {
    const hash = await bcrypt.hash(userData.password, 12);
    userData.password = hash;
    const newUser = new User(userData);
    return await newUser.save();
};

/**
 * Authenticates a user and returns a JWT token.
 * 
 * @param {string} email - The user's email address.
 * @param {string} password - The plaintext password to verify.
 * @returns {Promise<{token: string, user: Object}>} The token and user data.
 * @throws {NotFoundError} If no user exists with the given email.
 * @throws {UnauthorizedError} If the password does not match.
 */
const loginUser = async (email, password) => {
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
    registerUser,
    loginUser
};
