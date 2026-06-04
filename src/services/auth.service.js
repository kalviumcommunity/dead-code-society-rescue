const User = require('../models/User');
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt.util');

/**
 * Create a new user with a hashed password.
 * @param {Object} userInput - Raw registration payload.
 * @returns {Promise<Object>} Persisted user document.
 * @throws {Error} If persistence fails.
 */
const register = async (userInput) => {
    // SMELL: [HIGH] Mass assignment from req.body enables NoSQL injection and privilege escalation.
    const userData = { ...userInput };

    userData.password = await bcrypt.hash(userData.password, 12);

    const newUser = new User(userData);
    return await newUser.save();
};

/**
 * Authenticate a user and return a JWT payload.
 * @param {string} email - User email address.
 * @param {string} password - Plaintext password.
 * @returns {Promise<Object>} Auth result with token or error message.
 * @throws {Error} If database lookup fails.
 */
const login = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        return { error: 'No user found with that email' };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
        const token = signToken(
            { id: user._id, role: user.role },
            { expiresIn: '12h' }
        );

        return { token: token, user: user };
    }

    return { error: 'Password does not match' };
};

module.exports = {
    register,
    login
};
