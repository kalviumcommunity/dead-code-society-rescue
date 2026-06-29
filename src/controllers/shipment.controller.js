var shipmentService = require('../services/shipment.service');

function listShipments(req, res) {
    shipmentService.listShipments(req.userId)
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

function getShipment(req, res) {
    shipmentService.getShipment(req.params.id, req.userId, req.userRole)
        .then(function(shipment) {
            res.json(shipment);
        })
        .catch(function(err) {
            res.json({ error: err.message || 'Error on findById' });
        });
}

function createShipment(req, res) {
    shipmentService.createShipment(req.body, req.userId)
        .then(function(saved) {
            res.json(saved);
        })
        .catch(function(err) {
            console.log('Error saving shipment');
            res.json({ error: err.message || err });
        });
}

function updateShipmentStatus(req, res) {
    shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userRole)
        .then(function(doc) {
            res.json(doc);
        })
        .catch(function(err) {
            res.json({ error: err.message || 'Update failed' });
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
    listShipments: listShipments,
    getShipment: getShipment,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
