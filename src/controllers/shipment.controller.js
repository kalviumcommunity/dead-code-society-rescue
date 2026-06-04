const shipmentService = require('../services/shipment.service');
const { UnauthorizedError, NotFoundError } = require('../utils/errors.util');

/**
 * Handles fetching all shipments.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const getShipments = async (req, res, next) => {
    try {
        const result = await shipmentService.getShipments(req.userId);
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
 */
const getShipmentById = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id);
        if (!shipment) throw new NotFoundError('Shipment not found');
        if (shipment.userId._id.toString() !== req.userId && req.userRole !== 'admin') {
            throw new UnauthorizedError('No access to this shipment');
        }
        res.json(shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * Handles creation of a shipment.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
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
 */
const updateStatus = async (req, res, next) => {
    try {
        if (req.body.status === 'delivered') {
            if (req.userRole !== 'admin') throw new UnauthorizedError('Admins only can deliver');
        }
        const doc = await shipmentService.updateStatus(req.params.id, req.body.status);
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
 */
const deleteShipment = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(req.params.id);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (e) {
        next(e);
    }
};

module.exports = { getShipments, getShipmentById, createShipment, updateStatus, deleteShipment };
