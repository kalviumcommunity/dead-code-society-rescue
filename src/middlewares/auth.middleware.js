const jwt = require("jsonwebtoken");

const {
  UnauthorizedError,
} = require("../utils/errors.util");

/**
 * Verify JWT token
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {void}
 */
const authMiddleware = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError(
        "Access token required"
      );
    }

    const token =
      authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(
      new UnauthorizedError(
        "Invalid or expired token"
      )
    );
  }
};

module.exports = authMiddleware;