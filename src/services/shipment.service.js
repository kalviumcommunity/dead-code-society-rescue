const Shipment = require('../../models/Shipment');

/**
 * Retrieves all shipments for a specific user.
 * 
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @returns {Promise<Array>} An array of shipment documents with populated user data.
 */
const getShipments = async (userId) => {
    return await Shipment.find({ userId }).populate('userId', 'name email');
};

/**
 * Retrieves a specific shipment by ID.
 * 
 * @param {string} id - The MongoDB ObjectId of the shipment.
 * @returns {Promise<Object|null>} The shipment document, or null if not found.
 */
const getShipmentById = async (id) => {
    return await Shipment.findById(id);
};

/**
 * Creates a new shipment record and assigns it to the requesting user.
 *
 * @param {Object} data - Shipment data.
 * @param {string} data.destination - Destination address.
 * @param {string} data.origin - Origin address.
 * @param {string} data.carrier - Carrier name (e.g., 'FedEx', 'UPS').
 * @param {number} data.weight - Package weight.
 * @param {string} userId - MongoDB ObjectId of the user creating the shipment.
 * @returns {Promise<Object>} The created shipment document.
 */
const createShipment = async (data, userId) => {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    
    const newShipment = new Shipment({
        ...data,
        trackingId: trackId,
        userId: userId,
        status: 'pending' // magic string
    });

    return await newShipment.save();
};

/**
 * Updates the status of a specific shipment.
 * 
 * @param {string} id - The MongoDB ObjectId of the shipment.
 * @param {string} status - The new status of the shipment.
 * @returns {Promise<Object|null>} The updated shipment document.
 */
const updateShipmentStatus = async (id, status) => {
    return await Shipment.findByIdAndUpdate(id, { status }, { new: true });
};

/**
 * Deletes a shipment by ID.
 * 
 * @param {string} id - The MongoDB ObjectId of the shipment.
 * @returns {Promise<Object|null>} The deleted shipment document.
 */
const deleteShipment = async (id) => {
    // SMELL: [CRITICAL] Missing authorization check
    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    getShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
