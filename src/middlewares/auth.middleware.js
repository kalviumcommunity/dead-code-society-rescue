const { verifyToken } = require('../utils/jwt.util');

/**
 * Middleware to protect routes and verify JWT.
 */
const protect = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: missing token' });
    }

    try {
        const decoded = verifyToken(token);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }
};

/**
 * Middleware to restrict access to admins.
 */
const adminOnly = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    next();
};

module.exports = {
    protect,
    adminOnly
};
