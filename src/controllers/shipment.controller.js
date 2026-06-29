const shipmentService = require('../services/shipment.service');

/**
 * Controller action to retrieve all shipments for the authenticated user.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
async function listShipments(req, res, next) {
    try {
        const shipments = await shipmentService.getShipmentsByUserId(req.userId);
        res.json({
            status: 'success',
            results: shipments.length,
            data: shipments
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Controller action to retrieve a specific shipment by ID.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
async function getShipment(req, res, next) {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
        res.json(shipment);
    } catch (err) {
        next(err);
    }
}

/**
 * Controller action to create a new shipment.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
async function createShipment(req, res, next) {
    try {
        const saved = await shipmentService.createShipment(req.body, req.userId);
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
}

/**
 * Controller action to update a shipment's status.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
async function updateStatus(req, res, next) {
    try {
        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userId, req.userRole);
        res.json(doc);
    } catch (err) {
        next(err);
    }
}

/**
 * Controller action to delete a shipment.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
async function deleteShipment(req, res, next) {
    try {
        await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    listShipments,
    getShipment,
    createShipment,
    updateStatus,
    deleteShipment
};
