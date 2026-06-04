const jwtUtil = require('../utils/jwt.util');

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
