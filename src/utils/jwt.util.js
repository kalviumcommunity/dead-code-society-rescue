const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = '12h';

/**
 * Signs a JWT for the given user payload.
 * @param {{id: string, role: string}} payload - User identity payload.
 * @returns {string} Signed JWT token.
 */
const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: JWT_EXPIRES_IN });

/**
 * Verifies and decodes a JWT token.
 * @param {string} token - JWT token.
 * @returns {{id: string, role: string, iat: number, exp: number}} Decoded payload.
 */
const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET || 'secret123');

module.exports = {
  JWT_EXPIRES_IN,
  signToken,
  verifyToken,
};
