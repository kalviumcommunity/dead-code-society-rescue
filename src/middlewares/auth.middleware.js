const { verifyToken } = require('../utils/jwt.util');

/**
 * Verify JWT and attach user context to the request.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next handler.
 * @returns {void} Sends a JSON error or calls next.
 * @throws {Error} When token verification fails unexpectedly.
 */
const authMiddleware = (req, res, next) => {
    const header = req.headers['authorization'];

    if (!header) {
        return res.json({ error: 'Unauthorized: missing token' });
    }

    const token = header.startsWith('Bearer ') ? header.slice(7) : header;

    try {
        const decoded = verifyToken(token);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        return next();
    } catch (err) {
        return res.json({ error: 'Unauthorized: invalid token' });
    }
};

module.exports = authMiddleware;
