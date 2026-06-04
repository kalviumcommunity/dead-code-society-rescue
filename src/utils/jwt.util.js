const jwt = require('jsonwebtoken');

/**
 * Signs a JWT access token.
 * @param {object} payload - Token payload.
 * @returns {string} Signed JWT.
 */
function signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
}

/**
 * Verifies a JWT access token.
 * @param {string} token - JWT string.
 * @returns {object} Decoded payload.
 */
function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * Extracts a bearer token from an Authorization header.
 * @param {string|undefined} headerValue - Authorization header value.
 * @returns {string|null} The raw token or null.
 */
function extractBearerToken(headerValue) {
    if (!headerValue) {
        return null;
    }

    if (headerValue.startsWith('Bearer ')) {
        return headerValue.slice(7).trim();
    }

    return headerValue.trim();
}

module.exports = {
    extractBearerToken,
    signAccessToken,
    verifyAccessToken,
};