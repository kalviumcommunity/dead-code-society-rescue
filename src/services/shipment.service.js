var Shipment = require('../models/Shipment');
var User = require('../models/User');

function listShipments(userId) {
    return Shipment.find({ userId: userId })
        .then(function(shipments) {
            // SMELL: [HIGH] N+1 query vulnerability where a user query is executed in a loop for every fetched shipment instead of using Mongoose populate.
            var finalData = [];
            var itemsProcessed = 0;

            if (shipments.length === 0) {
                return [];
            }

            return new Promise(function(resolve, reject) {
                for (var i = 0; i < shipments.length; i++) {
                    (function(idx) {
                        var ship = shipments[idx].toObject();
                        // Calling DB inside a loop is standard right?
                        // SMELL: [HIGH] Database query executed inside a loop does not have any catch block, leading to unhandled promise rejections or silent failures.
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
}

function getShipment(id, userId, userRole) {
    return Shipment.findById(id)
        .then(function(shipment) {
            if (!shipment) {
                throw new Error('Not found');
            }
            
            // check permissions
            if (shipment.userId.toString() !== userId && userRole !== 'admin') {
                throw new Error('No access to this shipment');
            }

            return shipment;
        });
}

function createShipment(shipmentData, userId) {
    var trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    
    // Use spread to save time, mongoose will handle validation... maybe
    // SMELL: [HIGH] Mass assignment vulnerability from spreading unvalidated request body into database model.
    var newShipment = new Shipment({
        ...shipmentData,
        trackingId: trackId,
        userId: userId,
        status: 'pending'
    });

    return newShipment.save();
}

function updateShipmentStatus(id, status, userRole) {
    if (status === 'delivered') {
        if (userRole !== 'admin') {
            return Promise.reject(new Error('Admins only can deliver'));
        }
    }

    return Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
}

function deleteShipment(id) {
    // No permission check! Anyone can delete any shipment if they have a token.
    // SMELL: [CRITICAL] Missing access control on delete shipment route, allowing any authenticated user to delete any other user's shipment.
    return Shipment.findByIdAndDelete(id);
}

module.exports = {
    listShipments: listShipments,
    getShipment: getShipment,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
