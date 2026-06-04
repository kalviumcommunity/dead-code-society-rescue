const jwt = require('jsonwebtoken');

function getSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }

    return secret;
}

/**
 * Signs a JWT for the provided payload.
 * @param {Object} payload - Claims to embed in the token.
 * @returns {string} Signed JWT string.
 * @throws {Error} If JWT_SECRET is missing.
 */
function signToken(payload) {
    return jwt.sign(payload, getSecret(), {
        expiresIn: '12h'
    });
}

/**
 * Verifies a JWT and returns its decoded payload.
 * @param {string} token - JWT string to verify.
 * @returns {Object} Decoded token payload.
 * @throws {Error} If the token is invalid or JWT_SECRET is missing.
 */
function verifyToken(token) {
    return jwt.verify(token, getSecret());
}

module.exports = {
    signToken: signToken,
    verifyToken: verifyToken
};