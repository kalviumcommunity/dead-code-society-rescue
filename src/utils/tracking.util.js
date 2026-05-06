/**
 * Generates a simple shipment tracking ID.
 * @returns {string} Tracking identifier.
 */
function generateTrackingId() {
  return `SHIP-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

module.exports = {
  generateTrackingId
};
