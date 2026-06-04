/**
 * Generates a shipment tracking identifier.
 * @returns {string} Tracking ID string.
 */
function generateTrackingId() {
    return `SHIP-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

module.exports = generateTrackingId;