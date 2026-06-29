const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors.util');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Middleware to verify JWT token and authenticate user.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @throws {UnauthorizedError} If token is missing or invalid
 */
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return next(new UnauthorizedError('Unauthorized: missing token'));
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return next(new UnauthorizedError('Unauthorized: invalid token'));
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

module.exports = authMiddleware;
