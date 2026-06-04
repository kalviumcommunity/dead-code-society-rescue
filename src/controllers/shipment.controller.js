var shipmentService = require('../services/shipment.service');

function getUserShipments(req, res) {
    shipmentService.getUserShipments(req.userId)
        .then(function(result) {
            res.json(result);
        })
        .catch(function(err) {
            console.log(err);
            res.json({ error: 'Fetch failed' });
        });
}

function getShipmentById(req, res) {
    shipmentService.getShipmentById(req.params.id, req.userId, req.userRole)
        .then(function(result) {
            res.json(result);
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
    shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userRole)
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
        .catch(function(e) {
            res.json({ error: 'Delete error' });
        });
}

module.exports = {
    getUserShipments, getShipmentById, createShipment, updateShipmentStatus, deleteShipment
};
