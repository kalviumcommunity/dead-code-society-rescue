const Shipment = require('../models/Shipment');
const User = require('../models/User');

const getShipments = async (userId) => {
    const shipments = await Shipment.find({ userId: userId });
    const finalData = [];

    if (shipments.length === 0) {
        return { shipments: [] };
    }

    for (let i = 0; i < shipments.length; i++) {
        const ship = shipments[i].toObject();
        // SMELL: [HIGH] N+1 Query Problem. Querying DB inside a loop causes n+1 network calls.
        const u = await User.findById(ship.userId);
        ship.user_details = u;
        finalData.push(ship);
    }
    return { status: 'success', results: finalData.length, data: finalData };
};

const getShipmentById = async (id) => {
    return await Shipment.findById(id);
};

const createShipment = async (data, userId) => {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    const newShipment = new Shipment({
        ...data,
        trackingId: trackId,
        userId: userId,
        status: 'pending' // SMELL: [MEDIUM] Magic string 'pending'. Use constants.
    });
    return await newShipment.save();
};

const updateStatus = async (id, status) => {
    return await Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

const deleteShipment = async (id) => {
    // SMELL: [HIGH] Missing authorization check. Any logged-in user can delete any shipment.
    return await Shipment.findByIdAndDelete(id);
};

module.exports = { getShipments, getShipmentById, createShipment, updateStatus, deleteShipment };
