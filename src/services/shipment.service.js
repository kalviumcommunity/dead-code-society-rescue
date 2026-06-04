const Shipment = require('../../models/Shipment');

const getShipments = async (userId) => {
    return await Shipment.find({ userId }).populate('userId', 'name email');
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
