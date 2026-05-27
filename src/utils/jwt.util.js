const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Generate a JWT token for a user
 * @param {Object} payload - The payload to encode in the token (should contain id and role)
 * @returns {string} The signed JWT token
 * @throws {Error} If JWT_SECRET is not set
 */
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
};

/**
 * Verify a JWT token
 * @param {string} token - The token to verify
 * @returns {Object} The decoded token payload containing id and role
 * @throws {Error} If the token is invalid or expired
 */
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken
};
