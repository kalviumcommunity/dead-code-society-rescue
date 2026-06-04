const shipmentService = require('../services/shipment.service');
const { UnauthorizedError, NotFoundError } = require('../utils/errors.util');

const getShipments = async (req, res, next) => {
    try {
        const result = await shipmentService.getShipments(req.userId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const getShipmentById = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id);
        if (!shipment) throw new NotFoundError('Shipment not found');
        if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
            throw new UnauthorizedError('No access to this shipment');
        }
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

const updateStatus = async (req, res, next) => {
    try {
        if (req.body.status === 'delivered') {
            if (req.userRole !== 'admin') throw new UnauthorizedError('Admins only can deliver');
        }
        const doc = await shipmentService.updateStatus(req.params.id, req.body.status);
        res.json(doc);
    } catch (err) {
        next(err);
    }
};

const deleteShipment = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(req.params.id);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (e) {
        next(e);
    }
};

module.exports = { getShipments, getShipmentById, createShipment, updateStatus, deleteShipment };
