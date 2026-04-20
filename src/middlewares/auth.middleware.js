const jwt = require('jsonwebtoken');

// SMELL: [CRITICAL] Hardcoded fallback for JWT_SECRET. App should crash synchronously if the secret is not provided in environment variables.
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Express middleware to verify JWT tokens and inject user payload into the request object.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void}
 * @throws {Error} Will return 401 response if token is missing or invalid
 */
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized: invalid token' });
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    });
};

module.exports = authMiddleware;
