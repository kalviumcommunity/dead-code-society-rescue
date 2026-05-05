const jwt = require('jsonwebtoken');
const { AppError } = require('./errors.util');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Signs a JWT token for authenticated sessions.
 * @param {Object} payload - JWT payload.
 * @returns {string} Signed JWT.
 */
const signToken = (payload) => {
  if (!JWT_SECRET) {
    throw new AppError('JWT_SECRET is not configured', 500);
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
};

/**
 * Verifies a JWT and returns its decoded payload.
 * @param {string} token - JWT from the Authorization header.
 * @returns {Object} Decoded JWT payload.
 * @throws {AppError} When token is missing or invalid.
 */
const verifyToken = (token) => {
  if (!JWT_SECRET) {
    throw new AppError('JWT_SECRET is not configured', 500);
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AppError('Invalid token', 401);
  }
};

module.exports = { signToken, verifyToken };
