const shipmentService = require('../services/shipmentService');
const { sendJson } = require('../utils/response');

/**
 * Returns all shipments for the authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the shipment collection response.
 * @throws {Error} Any service error is forwarded to the error handler.
 */
async function listShipments(req, res, next) {
    const shipments = await shipmentService.listShipmentsForUser(req.user);
    return sendJson(res, 200, {
        status: 'success',
        results: shipments.length,
        data: shipments
    });
}

/**
 * Returns a single shipment for the authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the shipment response.
 * @throws {Error} Any service error is forwarded to the error handler.
 */
async function getShipment(req, res, next) {
    const shipment = await shipmentService.getShipmentById(req.params.id, req.user);
    return sendJson(res, 200, shipment);
}

/**
 * Creates a shipment for the authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the created shipment response.
 * @throws {Error} Any service error is forwarded to the error handler.
 */
async function createShipment(req, res, next) {
    const shipment = await shipmentService.createShipment(req.body, req.user);
    return sendJson(res, 201, shipment);
}

/**
 * Updates a shipment status for an authorized user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the updated shipment response.
 * @throws {Error} Any service error is forwarded to the error handler.
 */
async function updateShipmentStatus(req, res, next) {
    const shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.user);
    return sendJson(res, 200, shipment);
}

/**
 * Deletes a shipment for an authorized user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the deletion confirmation response.
 * @throws {Error} Any service error is forwarded to the error handler.
 */
async function deleteShipment(req, res, next) {
    const result = await shipmentService.deleteShipment(req.params.id, req.user);
    return sendJson(res, 200, result);
}

module.exports = {
    listShipments: listShipments,
    getShipment: getShipment,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
