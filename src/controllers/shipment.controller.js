const shipmentService = require('../services/shipment.service');

/**
 * Lists all shipments for the authenticated user.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const getShipments = async (req, res, next) => {
    try {
        const shipments = await shipmentService.listShipments(req.userId);
        res.status(200).json({
            status: 'success',
            results: shipments.length,
            data: shipments
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Gets a single shipment by ID.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const getShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
        res.status(200).json(shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * Creates a new shipment.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const createShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentService.createShipment(req.body, req.userId);
        res.status(201).json(shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * Updates status of a shipment.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const updateStatus = async (req, res, next) => {
    try {
        const shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userRole);
        res.status(200).json(shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * Deletes a shipment.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const deleteShipment = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
        res.status(200).json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getShipments,
    getShipment,
    createShipment,
    updateStatus,
    deleteShipment
};
