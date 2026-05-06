const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

/**
 * Signs a JWT for an authenticated user.
 * @param {Object} payload - Token payload.
 * @param {string} [expiresIn='12h'] - Token expiry.
 * @returns {string} Signed JWT.
 */
function signToken(payload, expiresIn = '12h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verifies a JWT and returns the decoded payload.
 * @param {string} token - JWT string.
 * @returns {Object} Decoded token payload.
 * @throws {jsonwebtoken.JsonWebTokenError} When the token is invalid.
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  signToken,
  verifyToken
};
