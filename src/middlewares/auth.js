/**
 * Authentication middleware.
 * Extracts JWT from Authorization header, verifies it, and attaches user to request.
 * Replaces duplicated auth blocks from routes.
 */

const { verifyToken } = require("../utils/jwt");
const { sendUnauthorized } = require("../utils/response");

/**
 * Middleware: Verify JWT token from Authorization header.
 * Attaches decoded token to req.user.
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware
 */
async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return sendUnauthorized(res, "Missing authorization token");
    }

    const decoded = verifyToken(token);
    req.user = decoded; // Attach {id, role, iat, exp}
    next();
  } catch (err) {
    return sendUnauthorized(res, err.message);
  }
}

module.exports = {
  authMiddleware,
};
