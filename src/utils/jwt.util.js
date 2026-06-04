const jwt = require('jsonwebtoken');

const DEFAULT_EXPIRY = '12h';

/**
 * Returns the configured JWT secret.
 * @returns {string} JWT secret.
 * @throws {Error} If the JWT secret is missing.
 */
const getJwtSecret = function() {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is required');
    }

    return process.env.JWT_SECRET;
};

/**
 * Signs a JWT for the authenticated user.
 * @param {object} payload - JWT payload.
 * @returns {string} Signed token.
 * @throws {Error} If signing fails or the secret is unavailable.
 */
const signToken = function(payload) {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRY
    });
};

/**
 * Verifies a JWT and returns the decoded payload.
 * @param {string} token - Raw JWT string.
 * @returns {object} Decoded JWT payload.
 * @throws {Error} If the token is invalid or expired.
 */
const verifyToken = function(token) {
    return jwt.verify(token, getJwtSecret());
};

module.exports = {
    getJwtSecret,
    signToken,
    verifyToken
};