const shipmentService = require('../services/shipment.service');

/**
 * Retrieves all shipments for the currently authenticated user.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 * @throws {Error} If retrieval fails
 */
const getShipments = async (req, res, next) => {
    try {
        const shipments = await shipmentService.getUserShipments(req.user.id);
        res.status(200).json({ status: 'success', results: shipments.length, data: shipments });
    } catch (err) {
        next(err);
    }
};

/**
 * Retrieves a specific shipment by its ID.
 * @param {import('express').Request} req - Express request object containing shipment ID
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 * @throws {NotFoundError} If shipment does not exist or user lacks access
 */
const getShipmentById = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id, req.user);
        res.status(200).json(shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * Creates a new shipment for the authenticated user.
 * @param {import('express').Request} req - Express request object containing shipment details
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 * @throws {ValidationError} If payload is invalid
 */
const createShipment = async (req, res, next) => {
    try {
        const saved = await shipmentService.createShipment(req.body, req.user.id);
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

/**
 * Updates the status of an existing shipment.
 * @param {import('express').Request} req - Express request object containing new status
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 * @throws {UnauthorizedError} If user role lacks privileges for specific statuses
 */
const updateShipmentStatus = async (req, res, next) => {
    try {
        const updated = await shipmentService.updateStatus(req.params.id, req.body.status, req.user);
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

/**
 * Deletes a shipment by ID.
 * @param {import('express').Request} req - Express request object containing shipment ID
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 * @throws {NotFoundError} If shipment is not found or user lacks access
 */
const deleteShipment = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(req.params.id, req.user);
        res.status(200).json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        next(err);
    }
};

module.exports = { getShipments, getShipmentById, createShipment, updateShipmentStatus, deleteShipment };
