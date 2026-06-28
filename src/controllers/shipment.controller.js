const shipmentService = require("../services/shipment.service");

/**
 * Get all shipments.
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
 * Create shipment.
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
 * Update shipment status.
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

module.exports = {
    getAll,
    create,
    updateStatus
};