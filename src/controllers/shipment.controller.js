const shipmentService = require('../services/shipment.service');
const asyncHandler = require('../middlewares/async-handler.middleware');

/**
 * Create a new shipment.
 * POST /api/shipments
 */
const create = asyncHandler(async (req, res) => {
    const shipment = await shipmentService.createShipment(req.body, req.auth.userId);
    res.status(201).json({
        success: true,
        message: 'Shipment created successfully',
        data: shipment
    });
});

/**
 * List all shipments for the user.
 * GET /api/shipments
 */
const list = asyncHandler(async (req, res) => {
    const shipments = await shipmentService.listShipments(req.auth.userId);
    res.status(200).json({
        success: true,
        count: shipments.length,
        data: shipments
    });
});

/**
 * Get a single shipment by ID.
 * GET /api/shipments/:id
 */
const getOne = asyncHandler(async (req, res) => {
    const shipment = await shipmentService.getShipment(
        req.params.id,
        req.auth.userId,
        req.auth.role
    );
    res.status(200).json({
        success: true,
        data: shipment
    });
});

/**
 * Update shipment status (admin only).
 * PATCH /api/shipments/:id/status
 */
const updateStatus = asyncHandler(async (req, res) => {
    const shipment = await shipmentService.updateStatus(
        req.params.id,
        req.body.status,
        req.auth.role
    );
    res.status(200).json({
        success: true,
        message: 'Shipment status updated',
        data: shipment
    });
});

/**
 * Delete a shipment (admin only).
 * DELETE /api/shipments/:id
 */
const deleteOne = asyncHandler(async (req, res) => {
    await shipmentService.deleteShipment(req.params.id, req.auth.role);
    res.status(200).json({
        success: true,
        message: 'Shipment deleted successfully'
    });
});

module.exports = {
    create,
    list,
    getOne,
    updateStatus,
    deleteOne
};
