const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.json({ error: 'Unauthorized: missing token' });
    }
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) {
            return res.json({ error: 'Unauthorized: invalid token' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
}

module.exports = authenticate;
