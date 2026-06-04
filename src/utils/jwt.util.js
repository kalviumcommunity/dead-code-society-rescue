const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Signs a payload to generate a JWT token with a 12-hour expiration.
 * @param {Object} payload - The token payload.
 * @returns {string} The signed JWT token.
 */
function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token to verify.
 * @returns {Object} The decoded payload.
 * @throws {Error} If token verification fails.
 */
function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    signToken: signToken,
    verifyToken: verifyToken
};
