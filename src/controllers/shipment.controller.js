const shipmentService = require('../services/shipment.service');
const { sendCreated, sendOk } = require('../utils/response.util');

/**
 * Lists shipments visible to the authenticated user.
 *
 * @param {import('express').Request} req - Express request object with auth context.
 * @param {import('express').Response} res - Express response object used to send the result.
 * @param {import('express').NextFunction} next - Express next callback for centralized error handling.
 * @returns {Promise<void>}
 * @throws {UnauthorizedError} If the request does not include a valid token.
 */
async function list(req, res, next) {
    try {
        const shipments = await shipmentService.listShipments(req.auth);

        return sendOk(res, {
            status: 'success',
            results: shipments.length,
            data: shipments
        });
    } catch (error) {
        return next(error);
    }
}

/**
 * Fetches one shipment by id for the authenticated user.
 *
 * @param {import('express').Request} req - Express request object containing the shipment id.
 * @param {import('express').Response} res - Express response object used to send the result.
 * @param {import('express').NextFunction} next - Express next callback for centralized error handling.
 * @returns {Promise<void>}
 * @throws {NotFoundError} If the shipment does not exist.
 * @throws {ForbiddenError} If the user cannot access the shipment.
 */
async function show(req, res, next) {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id, req.auth);

        return sendOk(res, shipment);
    } catch (error) {
        return next(error);
    }
}

/**
 * Creates a shipment for the authenticated user.
 *
 * @param {import('express').Request} req - Express request object containing the shipment payload.
 * @param {import('express').Response} res - Express response object used to send the result.
 * @param {import('express').NextFunction} next - Express next callback for centralized error handling.
 * @returns {Promise<void>}
 * @throws {ValidationError} If the carrier or payload is invalid.
 * @throws {NotFoundError} If the user id cannot be found.
 */
async function create(req, res, next) {
    try {
        const shipment = await shipmentService.createShipment(req.body, req.auth.userId);

        return sendCreated(res, shipment);
    } catch (error) {
        return next(error);
    }
}

/**
 * Updates a shipment status.
 *
 * @param {import('express').Request} req - Express request object containing the shipment id and status.
 * @param {import('express').Response} res - Express response object used to send the result.
 * @param {import('express').NextFunction} next - Express next callback for centralized error handling.
 * @returns {Promise<void>}
 * @throws {ForbiddenError} If a non-admin attempts to mark a shipment as delivered.
 * @throws {NotFoundError} If the shipment does not exist.
 */
async function updateStatus(req, res, next) {
    try {
        const shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.auth);

        return sendOk(res, shipment);
    } catch (error) {
        return next(error);
    }
}

/**
 * Deletes a shipment that belongs to the authenticated user or admin.
 *
 * @param {import('express').Request} req - Express request object containing the shipment id.
 * @param {import('express').Response} res - Express response object used to send the result.
 * @param {import('express').NextFunction} next - Express next callback for centralized error handling.
 * @returns {Promise<void>}
 * @throws {ForbiddenError} If the user is not allowed to delete the shipment.
 * @throws {NotFoundError} If the shipment does not exist.
 */
async function remove(req, res, next) {
    try {
        await shipmentService.deleteShipment(req.params.id, req.auth);

        return sendOk(res, { message: `Deleted ${req.params.id}` });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    list,
    show,
    create,
    updateStatus,
    remove
};