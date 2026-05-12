const express = require('express');

const systemController = require('../controllers/system.controller');
const asyncHandler = require('../utils/async-handler.util');

const router = express.Router();

router.get('/health', asyncHandler(systemController.health));
router.get('/status', asyncHandler(systemController.status));
router.get('/ping', asyncHandler(systemController.ping));

module.exports = router;