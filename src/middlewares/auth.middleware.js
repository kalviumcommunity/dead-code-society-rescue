const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors.util');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Middleware to authenticate requests using JWT.
 * Extracts the token from the Authorization header and verifies it.
 * If valid, decodes the payload and attaches userId and userRole to the request object.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void}
 * @throws {UnauthorizedError} If authorization header is missing or if the token is invalid/expired
 */
function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return next(new UnauthorizedError('Unauthorized: missing token'));
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new UnauthorizedError('Unauthorized: invalid token'));
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
}

module.exports = authenticate;
