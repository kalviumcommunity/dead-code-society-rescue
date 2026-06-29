const shipmentService = require('../services/shipment.service');

const listShipments = async (req, res, next) => {
    try {
        const data = await shipmentService.listShipments(req.userId);
        res.json({
            status: 'success',
            results: data.length,
            data: data
        });
    } catch (err) {
        next(err);
    }
};

const getShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipment(req.params.id, req.userId, req.userRole);
        res.json(shipment);
    } catch (err) {
        next(err);
    }
};

const createShipment = async (req, res, next) => {
    try {
        const saved = await shipmentService.createShipment(req.body, req.userId);
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

const updateShipmentStatus = async (req, res, next) => {
    try {
        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userRole);
        res.json(doc);
    } catch (err) {
        next(err);
    }
};

const deleteShipment = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    listShipments,
    getShipment,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
