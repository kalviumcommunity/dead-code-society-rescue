const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors.util');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return next(new UnauthorizedError('Unauthorized: missing token'));
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new UnauthorizedError('Unauthorized: invalid token'));
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
}

module.exports = authenticate;
