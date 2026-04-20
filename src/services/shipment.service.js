const Shipment = require('../../models/Shipment');
const { v4: uuidv4 } = require('uuid');
const { NotFoundError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Retrieves all shipments associated with a specific user ID.
 * @param {string} userId - The unique identifier of the user
 * @returns {Promise<Array>} Array of shipment objects with populated user details
 * @throws {Error} If the database query fails
 */
const getUserShipments = async (userId) => {
    // Before: 20 shipments = 21 queries (N+1 query problem using loops)
    // After: 20 shipments = 1 query using populate and lean
    return await Shipment.find({ userId })
        .populate('userId', 'name email role')
        .lean();
};

/**
 * Retrieves a single shipment by its ID, validating user access.
 * @param {string} shipmentId - The unique identifier of the shipment
 * @param {Object} user - The authenticated user requesting the shipment
 * @returns {Promise<Object>} The requested shipment document
 * @throws {NotFoundError} If the shipment is not found
 * @throws {UnauthorizedError} If the user is not the owner or an admin
 */
const getShipmentById = async (shipmentId, user) => {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) throw new NotFoundError('Shipment not found');
    
    if (shipment.userId.toString() !== user.id && user.role !== 'admin') {
        throw new UnauthorizedError('No access to this shipment');
    }
    return shipment;
};

/**
 * Creates a new shipment with an auto-generated tracking ID.
 * @param {Object} shipmentData - Validated payload for shipment creation
 * @param {string} userId - The unique identifier of the creating user
 * @returns {Promise<Object>} The newly created shipment document
 * @throws {Error} If saving to the database fails
 */
const createShipment = async (shipmentData, userId) => {
    const trackId = `SHIP-${Date.now()}-${uuidv4().substring(0, 8)}`;
    
    const newShipment = new Shipment({
        ...shipmentData,
        trackingId: trackId,
        userId: userId,
        status: 'pending'
    });

    return await newShipment.save();
};

/**
 * Updates the status of a specific shipment.
 * @param {string} shipmentId - The unique identifier of the shipment
 * @param {string} status - The new status to apply
 * @param {Object} user - The authenticated user performing the update
 * @returns {Promise<Object>} The updated shipment document
 * @throws {UnauthorizedError} If attempting to set 'delivered' status without admin privileges
 * @throws {Error} If the database update fails
 */
const updateStatus = async (shipmentId, status, user) => {
    if (status === 'delivered' && user.role !== 'admin') {
        throw new UnauthorizedError('Admins only can deliver');
    }

    return await Shipment.findByIdAndUpdate(
        shipmentId, 
        { status }, 
        { new: true, runValidators: true }
    );
};

/**
 * Deletes a shipment from the database, validating ownership.
 * @param {string} shipmentId - The unique identifier of the shipment
 * @param {Object} user - The authenticated user attempting deletion
 * @returns {Promise<boolean>} True if successfully deleted
 * @throws {NotFoundError} If shipment does not exist or user lacks permission
 */
const deleteShipment = async (shipmentId, user) => {
    const query = user.role === 'admin' 
        ? { _id: shipmentId } 
        : { _id: shipmentId, userId: user.id };

    const deleted = await Shipment.findOneAndDelete(query);
    if (!deleted) throw new NotFoundError('Shipment not found or no access');
    
    return true;
};

module.exports = { getUserShipments, getShipmentById, createShipment, updateStatus, deleteShipment };
