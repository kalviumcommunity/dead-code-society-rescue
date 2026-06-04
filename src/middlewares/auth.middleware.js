const { verifyToken } = require('../utils/jwt.util');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors.util');

const authenticate = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or malformed authorization header');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    if (err.name === 'UnauthorizedError') {
      return next(err);
    }
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

const authorizeAdmin = (req, _res, next) => {
  if (req.userRole !== 'admin') {
    return next(new ForbiddenError('Admin access required'));
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
