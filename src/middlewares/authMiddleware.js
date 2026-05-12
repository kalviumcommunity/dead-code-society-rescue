const auth = require('../utils/auth');
const response = require('../utils/response');

/**
 * Middleware to verify JWT token and attach user info to request
 */
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return response.error(res, 'Unauthorized: missing token', 401);
    }

    auth.verifyToken(token, (err, decoded) => {
        if (err) {
            return response.error(res, 'Unauthorized: invalid token', 401);
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

/**
 * Middleware to check if user is admin
 */
exports.isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return response.error(res, 'Forbidden: admin access required', 403);
    }
    next();
};
