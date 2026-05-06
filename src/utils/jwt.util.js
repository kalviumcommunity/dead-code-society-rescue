const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-logitrack-secret';

/**
 * Signs a JWT for the provided payload.
 *
 * @param {Object} payload - Token payload.
 * @returns {string} Signed JWT string.
 */
function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '12h'
    });
}

/**
 * Verifies a JWT and returns the decoded payload.
 *
 * @param {string} token - JWT to verify.
 * @returns {import('jsonwebtoken').JwtPayload | string} Decoded token payload.
 */
function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    JWT_SECRET,
    signToken,
    verifyToken
};