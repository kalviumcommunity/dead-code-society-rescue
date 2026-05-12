const shipmentService = require('../services/shipmentService');
const response = require('../utils/response');

/**
 * POST /shipments
 * Create a new shipment
 */
exports.createShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentService.createShipment(req.body, req.userId);
        response.success(res, shipment, 201);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /shipments
 * Get all shipments for the authenticated user
 */
exports.getShipments = async (req, res, next) => {
    try {
        const shipments = await shipmentService.getUserShipments(req.userId);
        response.success(res, {
            count: shipments.length,
            shipments
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /shipments/:id
 * Get a specific shipment by ID
 */
exports.getShipmentById = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
        response.success(res, shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /shipments/:id/status
 * Update shipment status
 */
exports.updateStatus = async (req, res, next) => {
    try {
        if (!req.body.status) {
            return response.error(res, 'Status is required');
        }

        const shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userId, req.userRole);
        response.success(res, shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /shipments/:id
 * Delete a shipment
 */
exports.deleteShipment = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
        response.success(res, { message: 'Shipment deleted successfully' });
    } catch (err) {
        next(err);
    }
};
