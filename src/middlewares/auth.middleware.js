const { verifyToken, JWT_SECRET } = require('../utils/jwt.util');

/**
 * Authentication middleware - verifies JWT token and attaches user data to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Unauthorized: missing token' 
    });
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      error: 'Unauthorized: invalid token' 
    });
  }
};

module.exports = authMiddleware;
