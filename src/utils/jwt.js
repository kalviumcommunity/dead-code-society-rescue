/**
 * JWT utilities for token generation and verification.
 */

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = "12h";

/**
 * Validate JWT secret is configured.
 * @throws {Error} - If JWT_SECRET not set
 */
function validateSecret() {
  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET not configured. Set JWT_SECRET environment variable.",
    );
  }
}

/**
 * Generate a JWT token for authenticated user.
 * @param {string} userId - User ID (MongoDB ObjectId)
 * @param {string} role - User role ('user' or 'admin')
 * @returns {string} - Signed JWT token
 * @throws {Error} - If token generation fails
 */
function generateToken(userId, role) {
  validateSecret();
  try {
    return jwt.sign({ id: userId, role }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });
  } catch (err) {
    throw new Error(`Failed to generate token: ${err.message}`);
  }
}

/**
 * Verify and decode a JWT token.
 * @param {string} token - JWT token string
 * @returns {object} - Decoded token payload {id, role, iat, exp}
 * @throws {Error} - If token invalid or expired
 */
function verifyToken(token) {
  validateSecret();
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    throw new Error(`Invalid token: ${err.message}`);
  }
}

module.exports = {
  generateToken,
  verifyToken,
  validateSecret,
};
