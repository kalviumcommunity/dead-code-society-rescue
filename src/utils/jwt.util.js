// ADDED: JWT utility functions for secure token generation and verification.
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Sign a JWT token.
 * @param {Object} payload - Token payload
 * @param {string} [expiresIn='12h'] - Expiration time
 * @returns {string} Signed token
 */
const signToken = (payload, expiresIn = '12h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token.
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken
};
