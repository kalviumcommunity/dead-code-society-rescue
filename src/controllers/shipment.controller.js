const shipmentService = require('../services/shipment.service');

const getShipments = async (req, res) => {
    try {
        const result = await shipmentService.getShipments(req.userId);
        res.json(result);
    } catch (err) {
        console.log(err);
        res.json({ error: 'Fetch failed' });
    }
};

const getShipmentById = async (req, res) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id);
        if (!shipment) return res.json({ error: 'Not found' });
        if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
            return res.json({ error: 'No access to this shipment' });
        }
        res.json(shipment);
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

const updateStatus = async (req, res) => {
    // SMELL: [MEDIUM] Magic string 'delivered' used for status.
    if (req.body.status === 'delivered') {
        if (req.userRole !== 'admin') return res.json({ error: 'Admins only can deliver' });
    }

    try {
        const doc = await shipmentService.updateStatus(req.params.id, req.body.status);
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

module.exports = { getShipments, getShipmentById, createShipment, updateStatus, deleteShipment };
