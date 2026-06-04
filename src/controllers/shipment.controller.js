var shipmentService = require('../services/shipment.service');

var listShipments = function(req, res) {
    shipmentService.getShipments(req.userId)
        .then(function(shipments) {
            if (shipments.length === 0) {
                return res.json({ shipments: [] });
            }
            res.json({
                status: 'success',
                results: shipments.length,
                data: shipments
            });
        })
        .catch(function(err) {
            console.log(err);
            res.json({ error: 'Fetch failed' });
        });
};

var getShipment = function(req, res) {
    shipmentService.getShipmentById(req.params.id)
        .then(function(shipment) {
            if (!shipment) {
                return res.json({ error: 'Not found' });
            }
            
            // check permissions
            if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
                return res.json({ error: 'No access to this shipment' });
            }

            res.json(shipment);
        })
        .catch(function(err) {
            res.json({ error: 'Error on findById' });
        });
};

var create = function(req, res) {
    shipmentService.createShipment(req.body, req.userId)
        .then(function(saved) {
            res.json(saved);
        })
        .catch(function(err) {
            console.log('Error saving shipment');
            res.json({ error: err });
        });
};

var updateStatus = function(req, res) {
    // logic: only admins can mark as delivered
    if (req.body.status === 'delivered') { // magic string comparison
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
};

var remove = function(req, res) {
    shipmentService.deleteShipment(req.params.id)
        .then(function() {
            res.json({ message: 'Deleted ' + req.params.id });
        })
        .catch(function(e) {
            res.json({ error: 'Delete error' });
        });
};

module.exports = {
    listShipments: listShipments,
    getShipment: getShipment,
    create: create,
    updateStatus: updateStatus,
    remove: remove
};
