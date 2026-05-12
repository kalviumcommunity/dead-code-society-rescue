const crypto = require('crypto');

/**
 * Generate a unique tracking ID
 * Uses crypto for cryptographically secure randomness and timestamp for uniqueness
 * Format: SHIP-<timestamp>-<random-hex>
 * @returns {string} Unique shipment tracking ID
 */
exports.generateTrackingId = function() {
    var timestamp = Date.now();
    var randomBytes = crypto.randomBytes(8).toString('hex');
    return 'SHIP-' + timestamp + '-' + randomBytes;
};
