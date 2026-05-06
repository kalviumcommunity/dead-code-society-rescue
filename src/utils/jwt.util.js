const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'
const TOKEN_EXPIRY = '12h'

/**
 * Generate a JWT token for a user.
 * @param {string} userId - MongoDB user ID
 * @param {string} role - User role (e.g., 'user', 'admin')
 * @returns {string} Signed JWT token
 */
const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )
}

/**
 * Verify a JWT token.
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    throw new Error('Invalid or expired token')
  }
}

module.exports = {
  generateToken,
  verifyToken
}
