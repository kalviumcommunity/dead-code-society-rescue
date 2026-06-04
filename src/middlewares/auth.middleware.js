const { verifyToken } = require('../utils/jwt.util');
const { UnauthorizedError } = require('../utils/errors.util');

/**
 * JWT authentication middleware.
 * Verifies the JWT token from the Authorization header and attaches
 * user ID and role to the request object.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: missing token' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'secret123';

  try {
    const decoded = verifyToken(token, jwtSecret);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
};

module.exports = {
  authenticate
};
