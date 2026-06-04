var Shipment = require('../models/Shipment');
var User = require('../models/User');

function getShipments(userId) {
    return Shipment.find({ userId: userId })
        .then(function(shipments) {
            if (shipments.length === 0) {
                return [];
            }
            return new Promise(function(resolve, reject) {
                var finalData = [];
                var itemsProcessed = 0;
                for (var i = 0; i < shipments.length; i++) {
                    (function(idx) {
                        var ship = shipments[idx].toObject();
                        User.findById(ship.userId)
                            .then(function(u) {
                                ship.user_details = u;
                                finalData.push(ship);
                                itemsProcessed++;
                                if (itemsProcessed === shipments.length) {
                                    resolve(finalData);
                                }
                            })
                            .catch(function(err) {
                                // Silent failure as per the original code
                            });
                    })(i);
                }
            });
        });
}

function getShipmentById(id) {
    return Shipment.findById(id);
}

function createShipment(shipmentData, userId) {
    var trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    var newShipment = new Shipment({
        ...shipmentData,
        trackingId: trackId,
        userId: userId,
        status: 'pending'
    });
    return newShipment.save();
}

function updateShipmentStatus(id, status) {
    return Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
}

function deleteShipment(id) {
    return Shipment.findByIdAndDelete(id);
}

module.exports = {
    getShipments: getShipments,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
