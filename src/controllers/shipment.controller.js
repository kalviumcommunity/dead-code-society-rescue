const shipmentService = require('../services/shipment.service');

/**
 * Returns all shipments visible to the current user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends a shipment collection.
 */
async function list(req, res) {
    const shipments = await shipmentService.listShipments(req.user);
    res.status(200).json({ success: true, results: shipments.length, data: shipments });
}

/**
 * Returns a single shipment by id.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends a shipment record.
 */
async function read(req, res) {
    const shipment = await shipmentService.getShipmentById(req.params.id, req.user);
    res.status(200).json({ success: true, data: shipment });
}

/**
 * Creates a shipment.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends the created shipment.
 */
async function create(req, res) {
    const shipment = await shipmentService.createShipment(req.body, req.user);
    res.status(201).json({ success: true, data: shipment });
}

/**
 * Updates a shipment status.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends the updated shipment.
 */
async function updateStatus(req, res) {
    const shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ success: true, data: shipment });
}

/**
 * Deletes a shipment.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends a deletion confirmation.
 */
async function remove(req, res) {
    const result = await shipmentService.deleteShipment(req.params.id, req.user);
    res.status(200).json({ success: true, ...result });
}

module.exports = {
    create,
    list,
    read,
    remove,
    updateStatus,
};