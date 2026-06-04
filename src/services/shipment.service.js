const Shipment = require('../../models/Shipment');
const User = require('../../models/User');

const getShipments = async (userId) => {
    const shipments = await Shipment.find({ userId });
    
    if (shipments.length === 0) return [];
    
    const finalData = [];
    for (const shipment of shipments) {
        const ship = shipment.toObject();
        const u = await User.findById(ship.userId);
        ship.user_details = u;
        finalData.push(ship);
    }
    return finalData;
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
        status: 'pending' // magic string
    });

    return await newShipment.save();
};

const updateShipmentStatus = async (id, status) => {
    return await Shipment.findByIdAndUpdate(id, { status }, { new: true });
};

const deleteShipment = async (id) => {
    // SMELL: [CRITICAL] Missing authorization check
    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    getShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
