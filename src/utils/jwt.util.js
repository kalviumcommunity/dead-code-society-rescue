const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '12h';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

/**
 * Signs a JSON Web Token for the provided payload.
 * @param {Object} payload - JWT claims to encode.
 * @returns {string} Signed JWT string.
 * @throws {Error} If signing fails.
 */
function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies a JSON Web Token and returns its decoded payload.
 * @param {string} token - Raw JWT string.
 * @returns {Object} Decoded JWT payload.
 * @throws {Error} If the token is missing, invalid, or expired.
 */
function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    signToken,
    verifyToken,
    JWT_SECRET,
    JWT_EXPIRES_IN
};