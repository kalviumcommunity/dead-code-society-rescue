const Shipment = require('../models/Shipment');
const User = require('../models/User');

async function getShipments(userId) {
    const shipments = await Shipment.find({ userId: userId });
    if (shipments.length === 0) {
        return [];
    }
    const finalData = [];
    for (let i = 0; i < shipments.length; i++) {
        const ship = shipments[i].toObject();
        try {
            const u = await User.findById(ship.userId);
            ship.user_details = u;
            finalData.push(ship);
        } catch (err) {
            // Silent failure as per the original code
        }
    }
    return finalData;
}

async function getShipmentById(id) {
    return await Shipment.findById(id);
}

async function createShipment(shipmentData, userId) {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    const newShipment = new Shipment({
        ...shipmentData,
        trackingId: trackId,
        userId: userId,
        status: 'pending'
    });
    return await newShipment.save();
}

async function updateShipmentStatus(id, status) {
    return await Shipment.findByIdAndUpdate(id, { status }, { new: true });
}

async function deleteShipment(id) {
    return await Shipment.findByIdAndDelete(id);
}

module.exports = {
    getShipments: getShipments,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
