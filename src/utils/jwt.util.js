const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Sign a JWT token.
 * @param {Object} payload - Data to be stored in token
 * @returns {string} The signed token
 */
const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
};

/**
 * Verify a JWT token.
 * @param {string} token - The token to verify
 * @returns {Object} The decoded payload
 * @throws {Error} If token is invalid
 */
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

module.exports = {
    signToken,
    verifyToken
};
