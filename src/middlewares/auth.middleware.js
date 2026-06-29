const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const authMiddleware = (req, res, next) => {
    // SMELL: [MEDIUM] Inline JWT verification instead of a centralized authentication middleware.
    const token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

module.exports = authMiddleware;
