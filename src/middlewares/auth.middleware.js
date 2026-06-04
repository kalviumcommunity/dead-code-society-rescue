const tokenUtils = require('../utils/token');
const { UnauthorizedError } = require('../utils/errors.util');

function extractToken(headerValue) {
    if (!headerValue) {
        return null;
    }

    if (headerValue.indexOf('Bearer ') === 0) {
        return headerValue.slice(7);
    }

    return headerValue;
}

function auth(req, res, next) {
    const token = extractToken(req.headers.authorization);

    if (!token) {
        return next(new UnauthorizedError('Unauthorized: missing token'));
    }

    try {
        const decoded = tokenUtils.verifyToken(token);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        return next();
    } catch (err) {
        return next(new UnauthorizedError('Unauthorized: invalid token'));
    }
}

module.exports = auth;