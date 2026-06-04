const shipmentService = require('../services/shipment.service');

async function getShipments(req, res) {
    try {
        const data = await shipmentService.getShipments(req.userId);
        res.json({
            status: 'success',
            results: data.length,
            data: data
        });
    } catch (err) {
        console.log(err);
        res.json({ error: 'Fetch failed' });
    }
}

async function getShipmentById(req, res) {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id);
        if (!shipment) {
            return res.json({ error: 'Not found' });
        }
        if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
            return res.json({ error: 'No access to this shipment' });
        }
        res.json(shipment);
    } catch (err) {
        res.json({ error: 'Error on findById' });
    }
}

async function createShipment(req, res) {
    try {
        const saved = await shipmentService.createShipment(req.body, req.userId);
        res.json(saved);
    } catch (err) {
        console.log('Error saving shipment');
        res.json({ error: err });
    }
}

async function updateShipmentStatus(req, res) {
    if (req.body.status === 'delivered') {
        if (req.userRole !== 'admin') {
            return res.json({ error: 'Admins only can deliver' });
        }
    }
    try {
        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status);
        res.json(doc);
    } catch (err) {
        res.json({ error: 'Update failed' });
    }
}

async function deleteShipment(req, res) {
    try {
        await shipmentService.deleteShipment(req.params.id);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        res.json({ error: 'Delete error' });
    }
}

module.exports = {
    getShipments: getShipments,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
