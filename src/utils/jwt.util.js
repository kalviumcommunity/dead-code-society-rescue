/**
 * @file jwt.util.js
 * @description JWT signing and verification utility
 */

const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL CONFIG ERROR: JWT_SECRET environment variable is not defined.');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRE || '1h';

/**
 * Signs a new JWT token
 * @param {string} userId - User ID to encode in token
 * @returns {string} - Signed JWT
 * @throws {Error} - If token generation fails
 */
const signToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verifies a JWT token
 * @param {string} token - Token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If verification fails
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken,
};
