/**
 * Shipment controller
 * Thin layer that handles shipment requests
 * Delegates business logic to shipmentService
 */

const shipmentService = require('../services/shipment.service');

/**
 * Create a new shipment for the authenticated user.
 * Request body should contain: origin, destination, weight, carrier (validated by middleware)
 *
 * @param {import('express').Request} req - Express request with validated body and userId
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 *
 * @example
 * POST /api/shipments
 * Headers: Authorization: <token>
 * Body: { origin: "NY", destination: "LA", weight: 25, carrier: "FedEx" }
 * Response: 201 { shipment: {...} }
 */
const create = async (req, res, next) => {
    try {
        const { origin, destination, weight, carrier } = req.body;

        const shipment = await shipmentService.create({
            origin,
            destination,
            weight,
            carrier
        }, req.userId);

        res.status(201).json({
            message: 'Shipment created successfully',
            shipment
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all shipments for the authenticated user.
 * Includes user details (populated) without N+1 queries.
 *
 * @param {import('express').Request} req - Express request with userId
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 *
 * @example
 * GET /api/shipments
 * Headers: Authorization: <token>
 * Response: 200 { shipments: [...] }
 */
const list = async (req, res, next) => {
    try {
        const shipments = await shipmentService.listByUser(req.userId);

        res.status(200).json({
            message: 'Shipments retrieved successfully',
            count: shipments.length,
            shipments
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get a single shipment by ID.
 * Checks ownership (user can only see their own unless they're admin).
 *
 * @param {import('express').Request} req - Express request with shipmentId, userId, userRole
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 *
 * @example
 * GET /api/shipments/:id
 * Headers: Authorization: <token>
 * Response: 200 { shipment: {...} }
 */
const getById = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getById(req.params.id);

        if (!shipment) {
            const { NotFoundError } = require('../utils/errors.util');
            return next(new NotFoundError('Shipment not found'));
        }

        // Check ownership: user can only view their own unless they're admin
        const isOwner = shipment.userId._id.toString() === req.userId;
        const isAdmin = req.userRole === 'admin';

        if (!isOwner && !isAdmin) {
            const { ForbiddenError } = require('../utils/errors.util');
            return next(new ForbiddenError('Not authorized to view this shipment'));
        }

        res.status(200).json({
            message: 'Shipment retrieved successfully',
            shipment
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Update shipment status.
 * Only owner or admin can update.
 *
 * @param {import('express').Request} req - Express request with shipmentId, status, userId, userRole
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 *
 * @example
 * PATCH /api/shipments/:id/status
 * Headers: Authorization: <token>
 * Body: { status: "delivered" }
 * Response: 200 { shipment: {...} }
 */
const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const updatedShipment = await shipmentService.updateStatus(
            req.params.id,
            status,
            req.userId,
            req.userRole
        );

        res.status(200).json({
            message: 'Shipment status updated successfully',
            shipment: updatedShipment
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Delete a shipment.
 * Only owner or admin can delete.
 *
 * @param {import('express').Request} req - Express request with shipmentId, userId, userRole
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function for error handling
 *
 * @example
 * DELETE /api/shipments/:id
 * Headers: Authorization: <token>
 * Response: 200 { message: "Shipment deleted successfully" }
 */
const deleteShipment = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(
            req.params.id,
            req.userId,
            req.userRole
        );

        res.status(200).json({
            message: 'Shipment deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    create,
    list,
    getById,
    updateStatus,
    deleteShipment
};
