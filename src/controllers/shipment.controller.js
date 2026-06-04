var shipmentService = require('../services/shipment.service');

function getShipments(req, res) {
    shipmentService.getShipments(req.userId)
        .then(function(data) {
            res.json({
                status: 'success',
                results: data.length,
                data: data
            });
        })
        .catch(function(err) {
            console.log(err);
            res.json({ error: 'Fetch failed' });
        });
}

function getShipmentById(req, res) {
    shipmentService.getShipmentById(req.params.id)
        .then(function(shipment) {
            if (!shipment) {
                return res.json({ error: 'Not found' });
            }
            if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
                return res.json({ error: 'No access to this shipment' });
            }
            res.json(shipment);
        })
        .catch(function(err) {
            res.json({ error: 'Error on findById' });
        });
}

function createShipment(req, res) {
    shipmentService.createShipment(req.body, req.userId)
        .then(function(saved) {
            res.json(saved);
        })
        .catch(function(err) {
            console.log('Error saving shipment');
            res.json({ error: err });
        });
}

function updateShipmentStatus(req, res) {
    if (req.body.status === 'delivered') {
        if (req.userRole !== 'admin') {
            return res.json({ error: 'Admins only can deliver' });
        }
    }
    shipmentService.updateShipmentStatus(req.params.id, req.body.status)
        .then(function(doc) {
            res.json(doc);
        })
        .catch(function(err) {
            res.json({ error: 'Update failed' });
        });
}

function deleteShipment(req, res) {
    shipmentService.deleteShipment(req.params.id)
        .then(function() {
            res.json({ message: 'Deleted ' + req.params.id });
        })
        .catch(function(err) {
            res.json({ error: 'Delete error' });
        });
}

module.exports = {
    getShipments: getShipments,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
