/**
 * Health check and status routes.
 * GET /health - Simple health check
 * GET /status - Detailed server status
 */

const express = require("express");
const router = express.Router();
const { sendSuccess } = require("../utils/response");
const os = require("os");

/**
 * GET /health
 * Simple health check endpoint.
 */
router.get("/health", (req, res) => {
  return sendSuccess(res, { status: "Server is running" });
});

/**
 * GET /status
 * Detailed server status information.
 */
router.get("/status", (req, res) => {
  const statusInfo = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    os: {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
    },
    timestamp: new Date().toISOString(),
  };

  return sendSuccess(res, statusInfo);
});

module.exports = router;
