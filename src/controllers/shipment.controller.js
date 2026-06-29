const shipmentService = require('../services/shipment.service');

const getAllShipments = async (req, res) => {
    try {
        const shipments = await shipmentService.getShipmentsForUser(req.userId);
        const finalData = await shipmentService.attachUserDetailsToShipments(shipments);
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

const getShipment = async (req, res) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id);
        if (!shipment) {
            return res.json({ error: 'Not found' });
        }
        
        // check permissions
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
        const saved = await shipmentService.createShipment(req.userId, req.body);
        res.json(saved);
    } catch (err) {
        console.log('Error saving shipment');
        res.json({ error: err.message || err });
    }
};

const updateStatus = async (req, res) => {
    try {
        // SMELL: [MEDIUM] Magic string comparison for status. Should use constants or enums.
        if (req.body.status === 'delivered') { // magic string comparison
            if (req.userRole !== 'admin') {
                return res.json({ error: 'Admins only can deliver' });
            }
        }

        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status);
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
    getAllShipments,
    getShipment,
    createShipment,
    updateStatus,
    deleteShipment
};
