const systemService = require('../services/system.service');

/**
 * Returns a lightweight service health response.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends health details.
 */
async function health(req, res) {
    res.status(200).json({ success: true, status: 'ok' });
}

/**
 * Returns runtime metadata for the application.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends status information.
 */
async function status(req, res) {
    const systemStatus = systemService.getSystemStatus();
    res.status(200).json({ success: true, data: systemStatus });
}

/**
 * Returns a ping response for smoke tests.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends a pong payload.
 */
async function ping(req, res) {
    res.status(200).json({ success: true, pong: 'active' });
}

module.exports = {
    health,
    ping,
    status,
};