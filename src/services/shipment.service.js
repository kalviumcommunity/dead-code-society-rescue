const Shipment = require('../models/Shipment');

/**
 * List shipments for a user with populated user info.
 * @param {string} userId - User id.
 * @returns {Promise<Object>} Shipment list payload.
 * @throws {Error} If the query fails.
 */
const listShipments = async (userId) => {
    const shipments = await Shipment.find({ userId: userId }).populate('userId');
    if (shipments.length === 0) {
        return { empty: true, shipments: [] };
    }

    const finalData = shipments.map((shipment) => {
        const ship = shipment.toObject();
        ship.user_details = ship.userId;
        return ship;
    });

    return { empty: false, shipments: finalData };
};

/**
 * Fetch a shipment by id.
 * @param {string} shipmentId - Shipment id.
 * @returns {Promise<Object|null>} Shipment document or null.
 * @throws {Error} If the query fails.
 */
const getShipmentById = async (shipmentId) => {
    return await Shipment.findById(shipmentId);
};

/**
 * Create a shipment for a user.
 * @param {Object} payload - Shipment payload.
 * @param {string} userId - Owner user id.
 * @returns {Promise<Object>} Persisted shipment document.
 * @throws {Error} If persistence fails.
 */
const createShipment = async (payload, userId) => {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);

    // SMELL: [HIGH] Accepting raw req.body allows unvalidated fields into the database.
    const newShipment = new Shipment({
        ...payload,
        trackingId: trackId,
        userId: userId,
        status: 'pending'
    });

    return await newShipment.save();
};

/**
 * Update a shipment status.
 * @param {string} shipmentId - Shipment id.
 * @param {string} status - New status value.
 * @returns {Promise<Object|null>} Updated shipment document.
 * @throws {Error} If the update fails.
 */
const updateShipmentStatus = async (shipmentId, status) => {
    return await Shipment.findByIdAndUpdate(shipmentId, { status: status }, { new: true });
};

/**
 * Delete a shipment by id.
 * @param {string} shipmentId - Shipment id.
 * @returns {Promise<Object|null>} Deleted shipment document.
 * @throws {Error} If the deletion fails.
 */
const deleteShipment = async (shipmentId) => {
    return await Shipment.findByIdAndDelete(shipmentId);
};

module.exports = {
    listShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
