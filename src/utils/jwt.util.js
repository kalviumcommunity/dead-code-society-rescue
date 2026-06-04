const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for a user.
 * @param {Object} payload - The payload to encode (typically user id and role)
 * @param {string} secret - The JWT secret key
 * @param {string} expiresIn - Token expiration time (default: '12h')
 * @returns {string} The generated JWT token
 */
const generateToken = (payload, secret, expiresIn = '12h') => {
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token to verify
 * @param {string} secret - The JWT secret key
 * @returns {Object} The decoded token payload
 * @throws {Error} If the token is invalid or expired
 */
const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken
};
