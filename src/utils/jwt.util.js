const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Generate a JWT token
 * @param {Object} payload - Payload to encode
 * @param {string} [expiresIn='12h'] - Expiration time
 * @returns {string} JWT token
 */
const generateToken = (payload, expiresIn = '12h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};