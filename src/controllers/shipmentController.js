const shipmentService = require('../services/shipmentService');
const response = require('../utils/response');

/**
 * POST /shipments
 * Create a new shipment
 */
exports.createShipment = async (req, res) => {
    try {
        const shipment = await shipmentService.createShipment(req.body, req.userId);
        response.success(res, shipment, 201);
    } catch (err) {
        console.log('Error creating shipment: ' + err);
        response.error(res, err.message || 'Cannot create shipment');
    }
};

/**
 * GET /shipments
 * Get all shipments for the authenticated user
 */
exports.getShipments = async (req, res) => {
    try {
        const shipments = await shipmentService.getUserShipments(req.userId);
        response.success(res, {
            count: shipments.length,
            shipments
        });
    } catch (err) {
        console.log('Error fetching shipments: ' + err);
        response.error(res, 'Cannot fetch shipments');
    }
};

/**
 * GET /shipments/:id
 * Get a specific shipment by ID
 */
exports.getShipmentById = async (req, res) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
        response.success(res, shipment);
    } catch (err) {
        console.log('Error fetching shipment: ' + err);
        response.error(res, err.message);
    }
};

/**
 * PATCH /shipments/:id/status
 * Update shipment status
 */
exports.updateStatus = async (req, res) => {
    try {
        if (!req.body.status) {
            return response.error(res, 'Status is required');
        }

        const shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userId, req.userRole);
        response.success(res, shipment);
    } catch (err) {
        console.log('Error updating shipment: ' + err);
        response.error(res, err.message);
    }
};

/**
 * DELETE /shipments/:id
 * Delete a shipment
 */
exports.deleteShipment = async (req, res) => {
    try {
        await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
        response.success(res, { message: 'Shipment deleted successfully' });
    } catch (err) {
        console.log('Error deleting shipment: ' + err);
        response.error(res, err.message);
    }
};
