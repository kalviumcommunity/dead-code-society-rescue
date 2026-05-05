const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = '12h';

/**
 * Signs a JWT for an authenticated user.
 * @param {{id: string, role: string}} payload - User claims.
 * @returns {string} Signed JWT token.
 */
const signAuthToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return token;
};

/**
 * Verifies a JWT token.
 * @param {string} token - Raw JWT token.
 * @returns {{id: string, role: string, iat: number, exp: number}} Decoded claims.
 * @throws {Error} If token is invalid or expired.
 */
const verifyAuthToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

module.exports = {
  JWT_EXPIRES_IN,
  signAuthToken,
  verifyAuthToken,
};
