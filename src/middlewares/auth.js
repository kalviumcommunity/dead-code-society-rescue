const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Authenticate requests using JWT.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const authenticate = (req, res, next) => {
  if (!JWT_SECRET) {
    return next(new AppError('JWT secret not configured', 500));
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return next(new AppError('Unauthorized: missing token', 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    return next();
  } catch (err) {
    return next(new AppError('Unauthorized: invalid token', 401));
  }
};

module.exports = {
  authenticate,
};
