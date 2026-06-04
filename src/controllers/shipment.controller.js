const shipmentService = require('../services/shipment.service');

const getUserShipments = async (req, res) => {
    try {
        const result = await shipmentService.getUserShipments(req.userId);
        res.json(result);
    } catch (err) {
        console.log(err);
        res.json({ error: 'Fetch failed' });
    }
};

const getShipmentById = async (req, res) => {
    try {
        const result = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
        res.json(result);
    } catch (err) {
        res.json({ error: 'Error on findById' });
    }
};

const createShipment = async (req, res) => {
    try {
        const saved = await shipmentService.createShipment(req.body, req.userId);
        res.json(saved);
    } catch (err) {
        console.log('Error saving shipment');
        res.json({ error: err });
    }
};

const updateShipmentStatus = async (req, res) => {
    try {
        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userRole);
        res.json(doc);
    } catch (err) {
        res.json({ error: 'Update failed' });
    }
};

const deleteShipment = async (req, res) => {
    try {
        await shipmentService.deleteShipment(req.params.id);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (e) {
        res.json({ error: 'Delete error' });
    }
};

module.exports = {
    getUserShipments, getShipmentById, createShipment, updateShipmentStatus, deleteShipment
};
