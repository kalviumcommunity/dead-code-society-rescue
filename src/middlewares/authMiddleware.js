const auth = require('../utils/auth');
const response = require('../utils/response');

/**
 * Middleware to verify JWT token and attach user info to request
 * Extracts token from Authorization header, verifies with JWT, attaches userId and userRole
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers with authorization token
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() on success or sends 401 error response
 * @throws {Error} Sends 401 response if token missing or invalid
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
 * Verifies user role and blocks non-admin access
 * @param {Object} req - Express request object
 * @param {string} req.userRole - User's role (attached by verifyToken middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() if admin or sends 403 error response
 * @throws {Error} Sends 403 response if user is not admin
 */
exports.isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return response.error(res, 'Forbidden: admin access required', 403);
    }
    next();
};
