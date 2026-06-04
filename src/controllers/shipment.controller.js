const shipmentService = require('../services/shipment.service');
const { UnauthorizedError, NotFoundError } = require('../utils/errors.util');

const listShipments = async (req, res, next) => {
    try {
        const shipments = await shipmentService.getShipments(req.userId);
        res.json({
            status: 'success',
            results: shipments.length,
            data: shipments
        });
    } catch (err) {
        next(err);
    }
};

const getShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id);
        if (!shipment) {
            throw new NotFoundError('Not found');
        }
        
        if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
            throw new UnauthorizedError('No access to this shipment');
        }

        res.json(shipment);
    } catch (err) {
        next(err);
    }
};

const create = async (req, res, next) => {
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
            if (req.userRole !== 'admin') {
                throw new UnauthorizedError('Admins only can deliver');
            }
        }

        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status);
        res.json(doc);
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(req.params.id);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    listShipments,
    getShipment,
    create,
    updateStatus,
    remove
};
