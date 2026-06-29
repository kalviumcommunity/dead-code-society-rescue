const shipmentService = require('../services/shipment.service');
const asyncWrapper = require('../utils/asyncWrapper');
const { NotFoundError, UnauthorizedError } = require('../utils/errors.util');

const getAllShipments = asyncWrapper(async (req, res) => {
    const finalData = await shipmentService.getShipmentsForUser(req.userId);
    res.json({
        status: 'success',
        results: finalData.length,
        data: finalData
    });
});

const getShipment = asyncWrapper(async (req, res) => {
    const shipment = await shipmentService.getShipmentById(req.params.id);
    if (!shipment) {
        throw new NotFoundError('Not found');
    }
    
    // check permissions
    if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
        throw new UnauthorizedError('No access to this shipment');
    }

    res.json(shipment);
});

const createShipment = asyncWrapper(async (req, res) => {
    const saved = await shipmentService.createShipment(req.userId, req.body);
    res.status(201).json(saved);
});

const updateStatus = asyncWrapper(async (req, res) => {
    if (req.body.status === 'delivered') {
        if (req.userRole !== 'admin') {
            throw new UnauthorizedError('Admins only can deliver');
        }
    }

    const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status);
    if (!doc) {
        throw new NotFoundError('Shipment not found');
    }
    res.json(doc);
});

const deleteShipment = asyncWrapper(async (req, res) => {
    const shipment = await shipmentService.getShipmentById(req.params.id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
        throw new UnauthorizedError('No access to delete this shipment');
    }

    await shipmentService.deleteShipment(req.params.id);
    res.json({ message: 'Deleted ' + req.params.id });
});

module.exports = {
    getAllShipments,
    getShipment,
    createShipment,
    updateStatus,
    deleteShipment
};
