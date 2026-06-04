var Shipment = require('../../models/Shipment');
var User = require('../../models/User');

var getShipments = function(userId) {
    return Shipment.find({ userId: userId })
        .then(function(shipments) {
            // SMELL: [CRITICAL] N+1 Query Problem. Making one DB request per loop iteration.
            return new Promise(function(resolve, reject) {
                var finalData = [];
                var itemsProcessed = 0;

                if (shipments.length === 0) {
                    return resolve([]);
                }

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
                            .catch(reject);
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
        // SMELL: [MEDIUM] Magic string for status
        status: 'pending' // magic string
    });

    return newShipment.save();
};

var updateShipmentStatus = function(id, status) {
    return Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

var deleteShipment = function(id) {
    // SMELL: [CRITICAL] Missing authorization check. Any logged in user can delete any shipment.
    return Shipment.findByIdAndDelete(id);
};

module.exports = {
    getShipments: getShipments,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
