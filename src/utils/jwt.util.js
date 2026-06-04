const jwt = require('jsonwebtoken');

// SMELL: [CRITICAL] Hardcoded JWT fallback secret allows token forgery in any environment.
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Sign a JWT for the given payload.
 * @param {Object} payload - Token payload.
 * @param {Object} options - JWT sign options.
 * @returns {string} Signed JWT string.
 * @throws {Error} If signing fails.
 */
const signToken = (payload, options) => {
    return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verify a JWT and return decoded payload.
 * @param {string} token - JWT string.
 * @returns {Object} Decoded token payload.
 * @throws {Error} If verification fails.
 */
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

module.exports = {
    signToken,
    verifyToken
};
