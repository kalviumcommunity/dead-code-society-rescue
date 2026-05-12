const os = require('os');

/**
 * Builds a lightweight health/status payload.
 * @returns {{ uptime: number, memory: number, platform: string, hostname: string }} System status details.
 */
function getSystemStatus() {
    return {
        hostname: os.hostname(),
        memory: os.freemem(),
        platform: os.type(),
        uptime: process.uptime(),
    };
}

module.exports = {
    getSystemStatus,
};