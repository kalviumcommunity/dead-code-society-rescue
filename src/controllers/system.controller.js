/**
 * Returns the service status payload.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {void} Sends the status payload.
 */
function status(req, res) {
    res.json({
        os: process.platform,
        release: process.version,
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    });
}

/**
 * Returns a simple ping payload.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {void} Sends the ping payload.
 */
function ping(req, res) {
    res.json({ pong: 'active' });
}

module.exports = {
    status,
    ping
};