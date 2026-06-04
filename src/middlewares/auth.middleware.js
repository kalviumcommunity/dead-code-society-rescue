var jwtUtil = require('../utils/jwt.util');

function protect(req, res, next) {
    var token = req.headers['authorization'];
    if (!token) {
        return res.json({ error: 'Unauthorized: missing token' });
    }
    
    jwtUtil.verifyToken(token, function(err, decoded) {
        if (err) {
            return res.json({ error: 'Unauthorized: invalid token' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
}

module.exports = {
    protect: protect
};
