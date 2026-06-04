const shipmentService = require('../services/shipment.service');

/**
 * GET /api/shipments
 * Returns all shipments belonging to the authenticated user.
 *
 * @param {import('express').Request}  req - Must have req.userId set by auth middleware
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getShipments = async (req, res, next) => {
    try {
        const shipments = await shipmentService.getShipments(req.userId);
        res.status(200).json({ success: true, results: shipments.length, data: shipments });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/shipments/:id
 * Returns a single shipment by ID (owner or admin only).
 *
 * @param {import('express').Request}  req - Must have req.userId and req.userRole
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getShipmentById = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(
            req.params.id,
            req.userId,
            req.userRole
        );
        res.status(200).json({ success: true, data: shipment });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/shipments
 * Creates a new shipment for the authenticated user.
 *
 * @param {import('express').Request}  req - Body validated by createShipmentSchema
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const createShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentService.createShipment(req.body, req.userId);
        res.status(201).json({ success: true, data: shipment });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/shipments/:id/status
 * Updates the status of a shipment (owner or admin only).
 * Only admins may set the status to 'delivered'.
 *
 * @param {import('express').Request}  req - Body validated by updateStatusSchema
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const updateShipmentStatus = async (req, res, next) => {
    try {
        const shipment = await shipmentService.updateShipmentStatus(
            req.params.id,
            req.body.status,
            req.userId,
            req.userRole
        );
        res.status(200).json({ success: true, data: shipment });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/shipments/:id
 * Deletes a shipment by ID (owner or admin only).
 *
 * @param {import('express').Request}  req - Must have req.userId and req.userRole
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const deleteShipment = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
        res.status(200).json({ success: true, message: 'Shipment deleted successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment,
};
