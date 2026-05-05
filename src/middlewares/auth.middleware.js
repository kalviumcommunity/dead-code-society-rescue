const { UnauthorizedError } = require('../utils/errors.util');
const { verifyToken } = require('../utils/jwt.util');

/**
 * Auth middleware for protected routes.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Express next middleware function.
 */
const authMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return next(new UnauthorizedError('Missing authorization header'));
  }

  const token = authorizationHeader.startsWith('Bearer ')
    ? authorizationHeader.slice(7)
    : authorizationHeader;

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    next(new UnauthorizedError('Invalid token'));
  }
};

module.exports = {
  authMiddleware
};
