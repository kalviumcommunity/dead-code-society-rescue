const os = require('os');

/**
 * Returns the API home response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} Sends a JSON status message.
 */
function home(req, res) {
    return res.json({ message: 'LogiTrack Backend running' });
}

/**
 * Returns runtime status information.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} Sends OS and process metrics.
 */
function status(req, res) {
    return res.json({
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    });
}

/**
 * Returns a lightweight liveness response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} Sends a pong response.
 */
function ping(req, res) {
    return res.json({ pong: 'active' });
}

module.exports = {
    home: home,
    status: status,
    ping: ping
};