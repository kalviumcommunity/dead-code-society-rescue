const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors.util');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
};

/**
 * Sign a JWT for an authenticated user.
 * @param {Object} payload - Token payload (id, role)
 * @returns {string} Signed JWT
 */
const signToken = (payload) =>
  jwt.sign(payload, getJwtSecret(), { expiresIn: '12h' });

/**
 * Verify a JWT and return decoded payload.
 * @param {string} token - JWT string
 * @returns {Object} Decoded token payload
 * @throws {UnauthorizedError} If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};

module.exports = {
  signToken,
  verifyToken,
  getJwtSecret,
};
