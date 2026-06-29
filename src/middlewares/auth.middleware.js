// ADDED: Authentication middleware to verify JWTs and set user information in the request object.
const { UnauthorizedError } = require('../utils/errors.util');
const { verifyToken } = require('../utils/jwt.util');

/**
 * Middleware to protect routes with JWT authentication.
 * Supports both standard 'Bearer <token>' and direct '<token>' values.
 */
const authMiddleware = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) {
    throw new UnauthorizedError('Unauthorized: missing token');
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    next(new UnauthorizedError('Unauthorized: invalid token'));
  }
};

module.exports = authMiddleware;
