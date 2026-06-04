var Shipment = require('../models/Shipment');
var User = require('../models/User');

function getUserShipments(userId) {
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
                        // SMELL: [HIGH] N+1 Query Problem. Fetching user inside a loop for each shipment. Use populate() instead.
                        User.findById(ship.userId)
                            .then(function(u) {
                                ship.user_details = u;
                                finalData.push(ship);
                                itemsProcessed++;

                                if (itemsProcessed === shipments.length) {
                                    resolve({
                                        status: 'success',
                                        results: finalData.length,
                                        data: finalData
                                    });
                                }
                            })
                            .catch(reject);
                    })(i);
                }
            });
        });
}

function getShipmentById(id, userId, userRole) {
    return Shipment.findById(id)
        .then(function(shipment) {
            if (!shipment) {
                return { error: 'Not found' };
            }
            if (shipment.userId.toString() !== userId && userRole !== 'admin') {
                return { error: 'No access to this shipment' };
            }
            return shipment;
        });
}

function createShipment(data, userId) {
    var trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    var newShipment = new Shipment({
        ...data,
        trackingId: trackId,
        userId: userId,
        status: 'pending'
    });
    return newShipment.save();
}

function updateShipmentStatus(id, status, userRole) {
    if (status === 'delivered') {
        if (userRole !== 'admin') {
            return Promise.resolve({ error: 'Admins only can deliver' });
        }
    }
    return Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
}

function deleteShipment(id) {
    // SMELL: [HIGH] Missing authorization check. Any authenticated user can delete any shipment.
    return Shipment.findByIdAndDelete(id);
}

module.exports = {
    getUserShipments, getShipmentById, createShipment, updateShipmentStatus, deleteShipment
};
