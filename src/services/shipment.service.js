const Shipment = require('../models/Shipment');
const User = require('../models/User');

const getShipmentsForUser = async (userId) => {
    const shipments = await Shipment.find({ userId }).populate('userId');
    return shipments.map(ship => {
        const doc = ship.toObject();
        doc.user_details = doc.userId;
        doc.userId = doc.userId._id;
        return doc;
    });
};

const getShipmentById = async (shipmentId) => {
    return await Shipment.findById(shipmentId);
};

const createShipment = async (userId, shipmentData) => {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    const newShipment = new Shipment({
        ...shipmentData,
        trackingId: trackId,
        userId: userId,
        status: 'pending'
    });
    return await newShipment.save();
};

const updateShipmentStatus = async (shipmentId, status) => {
    return await Shipment.findByIdAndUpdate(shipmentId, { status }, { new: true });
};

const deleteShipment = async (shipmentId) => {
    return await Shipment.findByIdAndDelete(shipmentId);
};

module.exports = {
    getShipmentsForUser,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
