const { verifyAuthToken } = require('../utils/jwt.util');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors.util');

const getTokenFromHeader = (authorizationHeader = '') => {
    if (!authorizationHeader) {
        return null;
    }

    if (authorizationHeader.startsWith('Bearer ')) {
        return authorizationHeader.slice(7).trim();
    }

    return authorizationHeader;
};

const requireAuth = (req, res, next) => {
    const token = getTokenFromHeader(req.headers.authorization);

    if (!token) {
        return next(new UnauthorizedError('Missing authorization token'));
    }

    try {
        const decoded = verifyAuthToken(token);
        req.auth = {
            userId: decoded.id,
            role: decoded.role
        };
        return next();
    } catch (error) {
        return next(new UnauthorizedError('Invalid or expired token'));
    }
};

const requireAdmin = (req, res, next) => {
    if (!req.auth || req.auth.role !== 'admin') {
        return next(new ForbiddenError('Admin access required'));
    }
    return next();
};

module.exports = {
    requireAuth,
    requireAdmin
};
