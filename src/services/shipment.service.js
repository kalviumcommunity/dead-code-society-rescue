var Shipment = require('../models/Shipment');
var User = require('../models/User');

var getShipments = function(userId) {
    return Shipment.find({ userId: userId })
        .then(function(shipments) {
            var finalData = [];
            var itemsProcessed = 0;

            if (shipments.length === 0) {
                return { shipments: [] };
            }

            return new Promise(function(resolve, reject) {
                for (var i = 0; i < shipments.length; i++) {
                    (function(idx) {
                        var ship = shipments[idx].toObject();
                        // SMELL: [HIGH] N+1 Query Problem. Querying DB inside a loop causes n+1 network calls.
                        User.findById(ship.userId)
                            .then(function(u) {
                                ship.user_details = u;
                                finalData.push(ship);
                                itemsProcessed++;

                                if (itemsProcessed === shipments.length) {
                                    resolve({ status: 'success', results: finalData.length, data: finalData });
                                }
                            }); 
                            // SMELL: [HIGH] Missing .catch() inside loop DB query. Silent failure risk.
                    })(i);
                }
            });
        });
};

var getShipmentById = function(id) {
    return Shipment.findById(id);
};

var createShipment = function(data, userId) {
    var trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    var newShipment = new Shipment({
        ...data,
        trackingId: trackId,
        userId: userId,
        status: 'pending' // SMELL: [MEDIUM] Magic string 'pending'. Use constants.
    });
    return newShipment.save();
};

var updateStatus = function(id, status) {
    return Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

var deleteShipment = function(id) {
    // SMELL: [HIGH] Missing authorization check. Any logged-in user can delete any shipment.
    return Shipment.findByIdAndDelete(id);
};

module.exports = { getShipments, getShipmentById, createShipment, updateStatus, deleteShipment };
