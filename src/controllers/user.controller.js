// User controller stub
const User = require('../../models/User');
const os = require('os');
const { AppError, NotFoundError } = require('../utils/errors.util');

// GET /profile
/**
 * Get the authenticated user's profile
 * @route GET /profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return next(new NotFoundError('User not found'));
        }
        res.json(user);
    } catch (err) {
        next(new AppError('Error fetching profile', 500));
    }
};

// GET /status
/**
 * Get server status info
 * @route GET /status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const status = (req, res) => {
    const info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };
    res.json(info);
};

// GET /ping
/**
 * Ping endpoint for health check
 * @route GET /ping
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const ping = (req, res) => {
    res.json({ pong: 'active' });
};

module.exports = {
    getProfile,
    status,
    ping
};
