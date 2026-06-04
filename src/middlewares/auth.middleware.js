const jwtUtil = require('../utils/jwt.util');

/**
 * Express middleware to protect routes by validating a JSON Web Token (JWT).
 * Extracted user ID and role are attached to the request object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
function protect(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.json({ error: 'Unauthorized: missing token' });
    }
    
    try {
        const decoded = jwtUtil.verifyToken(token);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        return res.json({ error: 'Unauthorized: invalid token' });
    }
}

module.exports = {
    protect: protect
};
