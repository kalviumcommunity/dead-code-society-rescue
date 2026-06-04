const shipmentService = require('../services/shipment.service');
const { ForbiddenError } = require('../utils/errors.util');

/**
 * Controller handling request to list all shipments belonging to the logged-in user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 */
async function getShipments(req, res, next) {
    try {
        const data = await shipmentService.getShipments(req.userId);
        res.json({
            status: 'success',
            results: data.length,
            data: data
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Controller handling request to fetch a specific shipment by ID.
 * Enforces ownership or admin role access control.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 * @throws {ForbiddenError} If user is not the owner and not an admin.
 */
async function getShipmentById(req, res, next) {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id);
        if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
            throw new ForbiddenError('No access to this shipment');
        }
        res.json(shipment);
    } catch (err) {
        next(err);
    }
}

/**
 * Controller handling request to create a new shipment.
 * Responds with 201 Created and the created shipment details.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 */
async function createShipment(req, res, next) {
    try {
        const saved = await shipmentService.createShipment(req.body, req.userId);
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
}

/**
 * Controller handling status updates for a shipment.
 * Restricts "delivered" state changes to administrators.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 * @throws {ForbiddenError} If standard user tries to mark shipment as delivered.
 */
async function updateShipmentStatus(req, res, next) {
    try {
        if (req.body.status === 'delivered') {
            if (req.userRole !== 'admin') {
                throw new ForbiddenError('Admins only can deliver');
            }
        }
        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status);
        res.json(doc);
    } catch (err) {
        next(err);
    }
}

/**
 * Controller handling request to delete a shipment record.
 * Enforces ownership or admin role check.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 * @throws {ForbiddenError} If user is not the owner and not an admin.
 */
async function deleteShipment(req, res, next) {
    try {
        // Enforce ownership check before deleting a shipment
        const shipment = await shipmentService.getShipmentById(req.params.id);
        if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
            throw new ForbiddenError('No access to delete this shipment');
        }
        await shipmentService.deleteShipment(req.params.id);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getShipments: getShipments,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
