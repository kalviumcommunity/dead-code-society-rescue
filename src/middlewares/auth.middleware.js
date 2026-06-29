const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Middleware to authenticate requests via JWT tokens.
 * Extracts the token from the Authorization header, verifies it, and attaches the user's ID and role to the request.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void}
 */
function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: missing token' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: invalid token' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
}

module.exports = authenticate;
