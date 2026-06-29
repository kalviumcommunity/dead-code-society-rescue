var Shipment = require('../models/Shipment');
var User = require('../models/User');

var getShipmentsForUser = function(userId) {
    return Shipment.find({ userId: userId });
};

var getShipmentById = function(shipmentId) {
    return Shipment.findById(shipmentId);
};

var createShipment = function(userId, shipmentData) {
    var trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    // SMELL: [HIGH] Mass assignment vulnerability. Spread operator passes unvalidated body directly to model.
    var newShipment = new Shipment({
        ...shipmentData,
        trackingId: trackId,
        userId: userId,
        status: 'pending' // magic string
    });
    return newShipment.save();
};

var updateShipmentStatus = function(shipmentId, status) {
    return Shipment.findByIdAndUpdate(shipmentId, { status: status }, { new: true });
};

var deleteShipment = function(shipmentId) {
    // SMELL: [CRITICAL] Missing authorization check. Any authenticated user can delete any shipment.
    return Shipment.findByIdAndDelete(shipmentId);
};

var attachUserDetailsToShipments = function(shipments) {
    return new Promise(function(resolve, reject) {
        var finalData = [];
        var itemsProcessed = 0;

        if (shipments.length === 0) {
            return resolve([]);
        }

        for (var i = 0; i < shipments.length; i++) {
            (function(idx) {
                var ship = shipments[idx].toObject();
                // SMELL: [HIGH] N+1 Query problem. Querying the database inside a loop. Use .populate() instead.
                User.findById(ship.userId)
                    .then(function(u) {
                        ship.user_details = u;
                        finalData.push(ship);
                        itemsProcessed++;

                        if (itemsProcessed === shipments.length) {
                            resolve(finalData);
                        }
                    })
                    .catch(reject);
            })(i);
        }
    });
};

module.exports = {
    getShipmentsForUser: getShipmentsForUser,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment,
    attachUserDetailsToShipments: attachUserDetailsToShipments
};
