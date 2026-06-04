const os = require('os');

/**
 * GET /api/health — liveness check for load balancers.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @returns {void}
 */
const health = (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
  });
};

/**
 * GET /api/status — extended server diagnostics.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @returns {void}
 */
const status = (req, res) => {
  res.json({
    success: true,
    os: os.type(),
    release: os.release(),
    uptime: process.uptime(),
    memory: process.memoryUsage().rss,
  });
};

/**
 * GET /api/ping
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @returns {void}
 */
const ping = (req, res) => {
  res.json({ success: true, pong: 'active' });
};

module.exports = {
  health,
  status,
  ping,
};
