const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors.util');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '12h';

/**
 * Signs a JWT token with the given payload.
 *
 * @param {Object} payload - Data to encode in the token
 * @param {string} payload.id - MongoDB ObjectId of the user
 * @param {string} payload.role - Role of the user ('user' | 'admin')
 * @returns {string} Signed JWT string
 */
const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifies a JWT token and returns the decoded payload.
 *
 * @param {string} token - JWT string to verify
 * @returns {Object} Decoded payload
 * @throws {UnauthorizedError} If the token is missing, malformed, or expired
 */
const verifyToken = (token) => {
    if (!token) {
        throw new UnauthorizedError('Missing authentication token');
    }
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        throw new UnauthorizedError('Invalid or expired token');
    }
};

module.exports = { signToken, verifyToken };
