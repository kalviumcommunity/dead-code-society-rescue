const shipmentService = require('../services/shipment.service');

/**
 * Handles fetching all shipments for the authenticated user.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
const getUserShipments = async (req, res, next) => {
    try {
        const result = await shipmentService.getUserShipments(req.userId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * Handles fetching a single shipment by ID.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
const getShipmentById = async (req, res, next) => {
    try {
        const result = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
        if (result.error) return res.status(404).json(result);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * Handles creating a new shipment.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
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
 * Handles updating a shipment's status.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
const updateShipmentStatus = async (req, res, next) => {
    try {
        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userRole);
        if (doc && doc.error) return res.status(403).json(doc);
        res.json(doc);
    } catch (err) {
        next(err);
    }
};

/**
 * Handles deleting a shipment.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
const deleteShipment = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(req.params.id);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUserShipments, getShipmentById, createShipment, updateShipmentStatus, deleteShipment
};
