const shipmentService = require('../services/shipment.service');

const listShipments = async (req, res) => {
    try {
        const finalData = await shipmentService.listShipments(req.userId);
        res.json({
            status: 'success',
            results: finalData.length,
            data: finalData
        });
    } catch (err) {
        console.log(err);
        res.json({ error: 'Fetch failed' });
    }
};

const getShipmentById = async (req, res) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
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
        res.json({ error: err });
    }
};

const updateShipmentStatus = async (req, res) => {
    try {
        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userId, req.userRole);
        res.json(doc);
    } catch (err) {
        res.json({ error: err.message || 'Update failed' });
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
    listShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
