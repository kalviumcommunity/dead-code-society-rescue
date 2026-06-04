const shipmentService = require('../services/shipment.service');
const { ForbiddenError } = require('../utils/errors.util');

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

async function createShipment(req, res, next) {
    try {
        const saved = await shipmentService.createShipment(req.body, req.userId);
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
}

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
    getShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
