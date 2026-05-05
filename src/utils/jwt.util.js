const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Signs a JWT token with user data
 * @param {Object} payload - Data to encode in the token
 * @param {string} expiresIn - Token expiration time
 * @returns {string} Signed JWT token
 */
const signToken = (payload, expiresIn = '12h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verifies a JWT token
 * @param {string} token - Token to verify
 * @returns {Object} Decoded token data
 * @throws {Error} If token is invalid
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken,
  JWT_SECRET
};
