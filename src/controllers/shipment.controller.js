const shipmentService = require('../services/shipment.service');

/**
 * Returns all shipments owned by the authenticated user.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends the shipment list response.
 * @throws {ForbiddenError|NotFoundError|ValidationError} If listing fails.
 */
const listShipments = async function(req, res) {
    const shipments = await shipmentService.listShipments(req.user);
    res.json({
        status: 'success',
        results: shipments.length,
        data: shipments
    });
};

/**
 * Returns a single shipment for the authenticated user.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends the shipment document.
 * @throws {NotFoundError|ForbiddenError} If the shipment is unavailable or inaccessible.
 */
const getShipment = async function(req, res) {
    const shipment = await shipmentService.getShipmentById(req.params.id, req.user);
    res.json(shipment);
};

/**
 * Creates a shipment for the authenticated user.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends the created shipment document.
 * @throws {ValidationError} If the shipment payload is invalid.
 */
const createShipment = async function(req, res) {
    const shipment = await shipmentService.createShipment(req.body, req.user);
    res.status(201).json(shipment);
};

/**
 * Updates shipment status for the authenticated user.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends the updated shipment document.
 * @throws {ValidationError|ForbiddenError|NotFoundError} If the status update is invalid.
 */
const updateShipmentStatus = async function(req, res) {
    const shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.user);
    res.json(shipment);
};

/**
 * Deletes a shipment for the authenticated user.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a deletion confirmation.
 * @throws {ForbiddenError|NotFoundError} If the shipment cannot be deleted.
 */
const deleteShipment = async function(req, res) {
    const result = await shipmentService.deleteShipment(req.params.id, req.user);
    res.json(result);
};

module.exports = {
    listShipments,
    getShipment,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};