const Shipment = require('../models/Shipment');
const User = require('../models/User');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

const listShipments = async (userId) => {
    const shipments = await Shipment.find({ userId }).populate('userId');
    
    return shipments.map(s => {
        const ship = s.toObject();
        const userDetails = ship.userId;
        ship.userId = userDetails ? userDetails._id : null;
        ship.user_details = userDetails;
        return ship;
    });
};

const getShipment = async (id, userId, userRole) => {
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

const updateShipmentStatus = async (id, status, userRole) => {
    if (status === 'delivered') {
        if (userRole !== 'admin') {
            throw new ForbiddenError('Admins only can deliver');
        }
    }

    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    return await Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

const deleteShipment = async (id, userId, userRole) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }

    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('No access to delete this shipment');
    }

    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    listShipments,
    getShipment,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
