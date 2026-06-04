var Shipment = require('../models/Shipment');
var User = require('../models/User');

function listShipments(userId) {
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
                                itemsProcessed++;
                                if (itemsProcessed === shipments.length) {
                                    resolve(finalData);
                                }
                            });
                    })(i);
                }
            });
        });
}

function getShipmentById(id, userId, userRole) {
    return Shipment.findById(id)
        .then(function(shipment) {
            if (!shipment) {
                throw new Error('Not found');
            }
            if (shipment.userId.toString() !== userId && userRole !== 'admin') {
                throw new Error('No access to this shipment');
            }
            return shipment;
        });
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

function updateShipmentStatus(id, status, userId, userRole) {
    if (status === 'delivered') {
        if (userRole !== 'admin') {
            return Promise.reject(new Error('Admins only can deliver'));
        }
    }
    return Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
}

function deleteShipment(id) {
    return Shipment.findByIdAndDelete(id);
}

module.exports = {
    listShipments: listShipments,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
