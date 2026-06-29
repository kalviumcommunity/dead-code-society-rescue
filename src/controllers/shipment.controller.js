const shipmentService = require('../services/shipment.service');

/**
 * Express controller listing all shipments for the authenticated user.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
const listShipments = async (req, res, next) => {
    try {
        const data = await shipmentService.listShipments(req.userId);
        res.json({
            status: 'success',
            results: data.length,
            data: data
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Express controller fetching a single shipment by its ID.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
const getShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipment(req.params.id, req.userId, req.userRole);
        res.json(shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * Express controller creating a new shipment.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
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
 * Express controller updating a shipment's status.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
const updateShipmentStatus = async (req, res, next) => {
    try {
        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userRole);
        res.json(doc);
    } catch (err) {
        next(err);
    }
};

/**
 * Express controller deleting a shipment.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
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
    getShipment,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
