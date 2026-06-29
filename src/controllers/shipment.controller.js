var shipmentService = require('../services/shipment.service');

var getAllShipments = function(req, res) {
    shipmentService.getShipmentsForUser(req.userId)
        .then(function(shipments) {
            shipmentService.attachUserDetailsToShipments(shipments)
                .then(function(finalData) {
                    res.json({
                        status: 'success',
                        results: finalData.length,
                        data: finalData
                    });
                })
                .catch(function(err) {
                    res.json({ error: 'Fetch failed' });
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

var createShipment = function(req, res) {
    shipmentService.createShipment(req.userId, req.body)
        .then(function(saved) {
            res.json(saved);
        })
        .catch(function(err) {
            console.log('Error saving shipment');
            res.json({ error: err });
        });
};

var updateStatus = function(req, res) {
    // SMELL: [MEDIUM] Magic string comparison for status. Should use constants or enums.
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

var deleteShipment = function(req, res) {
    shipmentService.deleteShipment(req.params.id)
        .then(function() {
            res.json({ message: 'Deleted ' + req.params.id });
        })
        .catch(function(e) {
            res.json({ error: 'Delete error' });
        });
};

module.exports = {
    getAllShipments: getAllShipments,
    getShipment: getShipment,
    createShipment: createShipment,
    updateStatus: updateStatus,
    deleteShipment: deleteShipment
};
