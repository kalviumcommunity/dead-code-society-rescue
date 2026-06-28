const shipmentService = require("../services/shipment.service");

/**
 * Handles GET /api/shipments. Returns all shipments owned by the authenticated user.
 * @param {import('express').Request} req - Express request; req.user is set by the auth middleware
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function, used to forward errors
 * @returns {Promise<void>}
 */
const getAll = async (req, res, next) => {
    try {
        const shipments = await shipmentService.getShipments(req.user);

        res.json({
            success: true,
            count: shipments.length,
            data: shipments
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handles POST /api/shipments. Creates a new shipment owned by the authenticated user.
 * @param {import('express').Request} req - Express request; req.body is the validated shipment payload, req.user is set by the auth middleware
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function, used to forward errors
 * @returns {Promise<void>}
 */
const create = async (req, res, next) => {
    try {
        const shipment = await shipmentService.createShipment(
            req.body,
            req.user.id
        );

        res.status(201).json({
            success: true,
            data: shipment
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handles PATCH /api/shipments/:id/status. Updates a shipment's status;
 * marking a shipment "delivered" requires the admin role.
 * @param {import('express').Request} req - Express request; req.params.id is the shipment id, req.body.status is the new status, req.user is set by the auth middleware
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function, used to forward errors
 * @returns {Promise<void>}
 */
const updateStatus = async (req, res, next) => {
    try {
        const shipment = await shipmentService.updateStatus(
            req.params.id,
            req.body.status,
            req.user.role
        );

        res.json({
            success: true,
            data: shipment
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handles GET /api/shipments/:id. Returns a single shipment if the
 * requester is its owner or an admin.
 * @param {import('express').Request} req - Express request; req.params.id is the shipment id, req.user is set by the auth middleware
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function, used to forward errors
 * @returns {Promise<void>}
 */
const getById = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(
            req.params.id,
            req.user
        );

        res.json({
            success: true,
            data: shipment
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handles DELETE /api/shipments/:id. Deletes a shipment if the
 * requester is its owner or an admin.
 * @param {import('express').Request} req - Express request; req.params.id is the shipment id, req.user is set by the auth middleware
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function, used to forward errors
 * @returns {Promise<void>}
 */
const remove = async (req, res, next) => {
    try {
        await shipmentService.removeShipment(req.params.id, req.user);

        res.json({
            success: true,
            message: `Shipment ${req.params.id} deleted`
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    updateStatus,
    remove
};