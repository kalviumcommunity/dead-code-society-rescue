const { verifyToken } = require('../utils/jwt.util');

/**
 * Authentication middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Error} If token is missing or invalid
 */
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.json({ error: 'Unauthorized: missing token' });
    }
    
    try {
        const decoded = verifyToken(token);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        return res.json({ error: 'Unauthorized: invalid token' });
    }
};

module.exports = authMiddleware;
