const shipmentService = require('../services/shipment.service');

/**
 * GET /api/shipments
 * Returns all shipments belonging to the authenticated user.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const listShipments = async (req, res, next) => {
    try {
        const shipments = await shipmentService.getShipmentsByUser(req.user.id);
        res.status(200).json({ results: shipments.length, data: shipments });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/shipments/:id
 * Returns a single shipment by ID (ownership enforced).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(
            req.params.id,
            req.user.id,
            req.user.role
        );
        res.status(200).json({ data: shipment });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/shipments
 * Creates a new shipment for the authenticated user.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentService.createShipment(req.body, req.user.id);
        res.status(201).json({ message: 'Shipment created', data: shipment });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/shipments/:id/status
 * Updates the status of a shipment (admin-only for 'delivered').
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const updateStatus = async (req, res, next) => {
    try {
        const shipment = await shipmentService.updateShipmentStatus(
            req.params.id,
            req.body.status,
            req.user.id,
            req.user.role
        );
        res.status(200).json({ message: 'Status updated', data: shipment });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/shipments/:id
 * Deletes a shipment (ownership enforced).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const deleteShipment = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ message: `Shipment ${req.params.id} deleted` });
    } catch (err) {
        next(err);
    }
};

module.exports = { listShipments, getShipment, createShipment, updateStatus, deleteShipment };
