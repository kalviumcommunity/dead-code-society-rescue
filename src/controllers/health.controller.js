const os = require('os');

/**
 * Return service health info.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @returns {void} Sends a JSON response.
 */
const status = (req, res) => {
    // SMELL: [MEDIUM] Exposing OS and memory details leaks operational information.
    const info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };
    res.json(info);
};

/**
 * Return a liveness response.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @returns {void} Sends a JSON response.
 */
const ping = (req, res) => {
    res.json({ pong: 'active' });
};

module.exports = {
    status,
    ping
};
