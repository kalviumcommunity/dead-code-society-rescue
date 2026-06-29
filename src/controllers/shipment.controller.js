const shipmentService = require('../services/shipment.service');

const listShipments = async (req, res) => {
    try {
        const data = await shipmentService.listShipments(req.userId);
        res.json({
            status: 'success',
            results: data.length,
            data: data
        });
    } catch (err) {
        console.log(err);
        res.json({ error: 'Fetch failed' });
    }
};

const getShipment = async (req, res) => {
    try {
        const shipment = await shipmentService.getShipment(req.params.id, req.userId, req.userRole);
        res.json(shipment);
    } catch (err) {
        res.json({ error: err.message || 'Error on findById' });
    }
};

const createShipment = async (req, res) => {
    try {
        const saved = await shipmentService.createShipment(req.body, req.userId);
        res.json(saved);
    } catch (err) {
        console.log('Error saving shipment');
        res.json({ error: err.message || err });
    }
};

const updateShipmentStatus = async (req, res) => {
    try {
        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userRole);
        res.json(doc);
    } catch (err) {
        res.json({ error: err.message || 'Update failed' });
    }
};

const deleteShipment = async (req, res) => {
    try {
        await shipmentService.deleteShipment(req.params.id);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        res.json({ error: 'Delete error' });
    }
};

module.exports = {
    listShipments,
    getShipment,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
