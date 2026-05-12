var auth = require('../utils/auth');
var response = require('../utils/response');

/**
 * Middleware to verify JWT token and attach user info to request
 */
exports.verifyToken = function(req, res, next) {
    var token = req.headers['authorization'];
    
    if (!token) {
        return response.error(res, 'Unauthorized: missing token', 401);
    }

    auth.verifyToken(token, function(err, decoded) {
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
exports.isAdmin = function(req, res, next) {
    if (req.userRole !== 'admin') {
        return response.error(res, 'Forbidden: admin access required', 403);
    }
    next();
};
