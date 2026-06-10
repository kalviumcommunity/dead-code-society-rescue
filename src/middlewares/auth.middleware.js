/**
 * Authentication Middleware
 * 
 * Extracts JWT verification from individual routes into reusable middleware.
 * 
 * SECURITY IMPROVEMENTS:
 * 1. Centralizes JWT verification (DRY principle)
 * 2. Validates Bearer token format
 * 3. Prevents timing attacks with proper JWT verification
 * 4. Consistent authorization error handling
 * 5. Enforces JWT_SECRET from environment (no hardcoded fallback)
 */

const jwt = require('jsonwebtoken');

/**
 * Auth Middleware - Validates Bearer tokens and attaches user to request
 * 
 * Usage:
 *   router.get('/protected-route', authenticate, handler);
 * 
 * Behavior:
 * - Reads Authorization header
 * - Validates "Bearer <token>" format
 * - Verifies JWT signature and expiration
 * - Attaches decoded user info to req.user
 * - Returns 401 Unauthorized for missing/invalid tokens
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = (req, res, next) => {
    try {
        // Get authorization header
        const authHeader = req.headers['authorization'];

        // Validate header exists
        if (!authHeader) {
            return res.status(401).json({
                error: 'Unauthorized: missing authorization header'
            });
        }

        // Validate Bearer token format (Bearer <token>)
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
            return res.status(401).json({
                error: 'Unauthorized: invalid authorization format. Use "Bearer <token>"'
            });
        }

        const token = parts[1];

        // Get JWT secret from environment (CRITICAL - no hardcoded fallback)
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error('CRITICAL: JWT_SECRET environment variable not set');
            return res.status(500).json({
                error: 'Server configuration error'
            });
        }

        // Verify JWT signature and expiration
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                // Distinguish between different JWT errors
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        error: 'Unauthorized: token expired'
                    });
                } else if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json({
                        error: 'Unauthorized: invalid token'
                    });
                } else {
                    return res.status(401).json({
                        error: 'Unauthorized: authentication failed'
                    });
                }
            }

            // Token is valid - attach user info to request
            // SECURITY: Only attach necessary decoded values (id, role)
            req.user = {
                id: decoded.id,
                role: decoded.role
            };

            // Proceed to next middleware/route handler
            next();
        });
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(500).json({
            error: 'Server error during authentication'
        });
    }
};

module.exports = {
    authenticate
};
