var shipmentService = require('../services/shipmentService');
var response = require('../utils/response');

/**
 * POST /shipments
 * Create a new shipment
 */
exports.createShipment = function(req, res) {
    shipmentService.createShipment(req.body, req.userId, function(err, shipment) {
        if (err) {
            console.log('Error creating shipment: ' + err);
            return response.error(res, err.message || 'Cannot create shipment');
        }

        response.success(res, shipment, 201);
    });
};

/**
 * GET /shipments
 * Get all shipments for the authenticated user
 */
exports.getShipments = function(req, res) {
    shipmentService.getUserShipments(req.userId, function(err, shipments) {
        if (err) {
            console.log('Error fetching shipments: ' + err);
            return response.error(res, 'Cannot fetch shipments');
        }

        response.success(res, {
            count: shipments.length,
            shipments: shipments
        });
    });
};

/**
 * GET /shipments/:id
 * Get a specific shipment by ID
 */
exports.getShipmentById = function(req, res) {
    shipmentService.getShipmentById(req.params.id, req.userId, req.userRole, function(err, shipment) {
        if (err) {
            console.log('Error fetching shipment: ' + err);
            return response.error(res, err.message);
        }

        response.success(res, shipment);
    });
};

/**
 * PATCH /shipments/:id/status
 * Update shipment status
 */
exports.updateStatus = function(req, res) {
    if (!req.body.status) {
        return response.error(res, 'Status is required');
    }

    shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userId, req.userRole, function(err, shipment) {
        if (err) {
            console.log('Error updating shipment: ' + err);
            return response.error(res, err.message);
        }

        response.success(res, shipment);
    });
};

/**
 * DELETE /shipments/:id
 * Delete a shipment
 */
exports.deleteShipment = function(req, res) {
    shipmentService.deleteShipment(req.params.id, req.userId, req.userRole, function(err) {
        if (err) {
            console.log('Error deleting shipment: ' + err);
            return response.error(res, err.message);
        }

        response.success(res, { message: 'Shipment deleted successfully' });
    });
};
