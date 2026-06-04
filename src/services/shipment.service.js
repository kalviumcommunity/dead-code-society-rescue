const Shipment = require('../models/Shipment');
const User = require('../models/User');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

const listShipments = async (userId) => {
    // Populate the userId field while excluding the password hash for security
    const shipments = await Shipment.find({ userId: userId }).populate('userId', '-password');
    
    // Format the result to keep the same structure as the legacy response (user_details field)
    return shipments.map(shipment => {
        const ship = shipment.toObject();
        ship.user_details = ship.userId;
        ship.userId = ship.userId ? ship.userId._id : null;
        return ship;
    });
};

const getShipmentById = async (id, userId, userRole) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('No access to this shipment');
    }
    return shipment;
};

const createShipment = async (shipmentData, userId) => {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    const newShipment = new Shipment({
        ...shipmentData,
        trackingId: trackId,
        userId: userId,
        status: 'pending'
    });
    return await newShipment.save();
};

const updateShipmentStatus = async (id, status, userId, userRole) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }
    
    // Check general permissions (only owner or admin can access)
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('No access to this shipment');
    }
    
    // Check specific delivery constraint (only admins can deliver)
    if (status === 'delivered') {
        if (userRole !== 'admin') {
            throw new ForbiddenError('Admins only can deliver');
        }
    }
    return await Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

const deleteShipment = async (id, userId, userRole) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('No access to this shipment');
    }
    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    listShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
