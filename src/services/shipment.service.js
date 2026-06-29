const Shipment = require('../models/Shipment');
const User = require('../models/User');

const getShipmentsForUser = async (userId) => {
    return await Shipment.find({ userId });
};

const getShipmentById = async (shipmentId) => {
    return await Shipment.findById(shipmentId);
};

const createShipment = async (userId, shipmentData) => {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    // SMELL: [HIGH] Mass assignment vulnerability. Spread operator passes unvalidated body directly to model.
    const newShipment = new Shipment({
        ...shipmentData,
        trackingId: trackId,
        userId: userId,
        status: 'pending' // magic string
    });
    return await newShipment.save();
};

const updateShipmentStatus = async (shipmentId, status) => {
    return await Shipment.findByIdAndUpdate(shipmentId, { status }, { new: true });
};

const deleteShipment = async (shipmentId) => {
    // SMELL: [CRITICAL] Missing authorization check. Any authenticated user can delete any shipment.
    return await Shipment.findByIdAndDelete(shipmentId);
};

const attachUserDetailsToShipments = async (shipments) => {
    const finalData = [];
    
    if (shipments.length === 0) {
        return [];
    }

    for (let i = 0; i < shipments.length; i++) {
        const ship = shipments[i].toObject();
        // SMELL: [HIGH] N+1 Query problem. Querying the database inside a loop. Use .populate() instead.
        const u = await User.findById(ship.userId);
        ship.user_details = u;
        finalData.push(ship);
    }
    
    return finalData;
};

module.exports = {
    getShipmentsForUser,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment,
    attachUserDetailsToShipments
};
