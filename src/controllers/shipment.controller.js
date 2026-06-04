var shipmentService = require('../services/shipment.service');

function listShipments(req, res) {
    shipmentService.listShipments(req.userId)
        .then(function(finalData) {
            res.json({
                status: 'success',
                results: finalData.length,
                data: finalData
            });
        })
        .catch(function(err) {
            console.log(err);
            res.json({ error: 'Fetch failed' });
        });
}

function getShipmentById(req, res) {
    shipmentService.getShipmentById(req.params.id, req.userId, req.userRole)
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
            res.json({ error: err });
        });
}

function updateShipmentStatus(req, res) {
    shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userId, req.userRole)
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
        .catch(function(e) {
            res.json({ error: 'Delete error' });
        });
}

module.exports = {
    listShipments: listShipments,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
