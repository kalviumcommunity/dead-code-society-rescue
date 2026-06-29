const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors.util');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Express middleware to verify JWT authorization.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        throw new UnauthorizedError('Unauthorized: missing token');
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new UnauthorizedError('Unauthorized: invalid token'));
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;
