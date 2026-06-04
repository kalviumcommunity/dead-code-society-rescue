const Shipment = require('../models/Shipment');
const User = require('../models/User');

const getShipments = async (userId) => {
    const shipments = await Shipment.find({ userId: userId }).populate('userId', 'name email');
    return { status: 'success', results: shipments.length, data: shipments };
};

const getShipmentById = async (id) => {
    return await Shipment.findById(id).populate('userId', 'name email');
};

const createShipment = async (data, userId) => {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    const newShipment = new Shipment({
        ...data,
        trackingId: trackId,
        userId: userId,
        status: 'pending' 
    });
    return await newShipment.save();
};

const updateStatus = async (id, status) => {
    return await Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

const deleteShipment = async (id) => {
    return await Shipment.findByIdAndDelete(id);
};

module.exports = { getShipments, getShipmentById, createShipment, updateStatus, deleteShipment };
