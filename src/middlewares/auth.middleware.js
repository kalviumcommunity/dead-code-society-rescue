/**
 * @file auth.middleware.js
 * @description Middleware for JWT authentication
 */

const { verifyToken } = require('../utils/jwt.util');
const { UnauthorizedError } = require('../utils/errors.util');
const User = require('../models/User.model');

/**
 * Authentication middleware that extracts token from Authorization header,
 * verifies it and attaches current user to request object.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 * @throws {UnauthorizedError} - If token is missing, invalid or user no longer exists
 */
const auth = async (req, res, next) => {
  try {
    let token;

    // Extract Bearer token from header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('Authentication required. No token provided.');
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired authentication token. Please login again.');
    }

    // Check if user still exists in database
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new UnauthorizedError('The user belonging to this token no longer exists.');
    }

    // Attach current user to request object
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
