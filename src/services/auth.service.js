const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors.util');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Registers a new user with securely hashed password.
 * @param {Object} userData - Validated user registration data
 * @returns {Promise<Object>} The newly created user document
 * @throws {Error} If saving the user to the database fails (e.g., duplicate email)
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
 * Authenticates a user and returns a signed JWT.
 * @param {string} email - User email address
 * @param {string} password - Plain text password
 * @returns {Promise<{token: string, data: Object}>} Token and user profile data
 * @throws {UnauthorizedError} If credentials are invalid
 */
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedError('Invalid credentials');

    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '12h' }
    );

    return {
        token,
        data: { name: user.name, email: user.email, role: user.role }
    };
};

module.exports = { registerUser, loginUser };
