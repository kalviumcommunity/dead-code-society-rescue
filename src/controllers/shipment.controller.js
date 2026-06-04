const shipmentService = require('../services/shipment.service');

/**
 * Controller endpoint to retrieve a list of shipments for the logged-in user.
 *
 * @param {import('express').Request} req - Express request object containing authenticated userId
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 * @returns {Promise<void>}
 */
const listShipments = async (req, res, next) => {
    try {
        const finalData = await shipmentService.listShipments(req.userId);
        res.json({
            status: 'success',
            results: finalData.length,
            data: finalData
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Controller endpoint to retrieve a single shipment by its ID.
 *
 * @param {import('express').Request} req - Express request object containing shipment ID
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 * @returns {Promise<void>}
 */
const getShipmentById = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
        res.json(shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * Controller endpoint to create a new shipment.
 *
 * @param {import('express').Request} req - Express request object containing shipment body details
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 * @returns {Promise<void>}
 */
const createShipment = async (req, res, next) => {
    try {
        const saved = await shipmentService.createShipment(req.body, req.userId);
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

/**
 * Controller endpoint to update shipment status.
 *
 * @param {import('express').Request} req - Express request object containing shipment ID and status body
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 * @returns {Promise<void>}
 */
const updateShipmentStatus = async (req, res, next) => {
    try {
        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userId, req.userRole);
        res.json(doc);
    } catch (err) {
        next(err);
    }
};

/**
 * Controller endpoint to delete a shipment by ID.
 *
 * @param {import('express').Request} req - Express request object containing shipment ID
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 * @returns {Promise<void>}
 */
const deleteShipment = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    listShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
