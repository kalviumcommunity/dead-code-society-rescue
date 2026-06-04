const shipmentService = require('../services/shipment.service');

const listShipments = async (req, res, next) => {
    try {
        const finalData = await shipmentService.listShipments(req.userId);
        res.json({
            status: 'success',
            results: finalData.length,
            data: finalData
        });
    } catch (err) {
        next(err);
    }
};

const getShipmentById = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
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
        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userId, req.userRole);
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
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
