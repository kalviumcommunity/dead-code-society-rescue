const Shipment = require('../models/Shipment');
const User = require('../models/User');

const getUserShipments = async (userId) => {
    const shipments = await Shipment.find({ userId: userId }).populate('userId', '-password');
    
    if (shipments.length === 0) {
        return { shipments: [] };
    }
    
    // We map to add user_details to mimic previous API behavior for the client
    const finalData = shipments.map(ship => {
        const shipObj = ship.toObject();
        shipObj.user_details = shipObj.userId;
        shipObj.userId = shipObj.userId._id;
        return shipObj;
    });
    
    return {
        status: 'success',
        results: finalData.length,
        data: finalData
    };
};

const getShipmentById = async (id, userId, userRole) => {
    const shipment = await Shipment.findById(id).populate('userId', '-password');
    if (!shipment) {
        return { error: 'Not found' };
    }
    
    const ownerId = shipment.userId._id ? shipment.userId._id.toString() : shipment.userId.toString();
    if (ownerId !== userId && userRole !== 'admin') {
        return { error: 'No access to this shipment' };
    }
    return shipment;
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

const updateShipmentStatus = async (id, status, userRole) => {
    if (status === 'delivered') {
        if (userRole !== 'admin') {
            return { error: 'Admins only can deliver' };
        }
    }
    return await Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

const deleteShipment = async (id) => {
    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    getUserShipments, getShipmentById, createShipment, updateShipmentStatus, deleteShipment
};
