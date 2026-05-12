const crypto = require('crypto');

/**
 * Generate a unique tracking ID
 * Uses crypto for better randomness than Math.random()
 */
exports.generateTrackingId = function() {
    var timestamp = Date.now();
    var randomBytes = crypto.randomBytes(8).toString('hex');
    return 'SHIP-' + timestamp + '-' + randomBytes;
};
