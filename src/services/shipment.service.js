const Shipment = require('../models/Shipment');
const User = require('../models/User');

const listShipments = async (userId) => {
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
            // SMELL: [MEDIUM] Database query inside loop has no error handler or catch block, causing silent failures on DB errors.
        }
    }
    return finalData;
};

const getShipmentById = async (id, userId, userRole) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new Error('Not found');
    }
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new Error('No access to this shipment');
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
    if (status === 'delivered') {
        if (userRole !== 'admin') {
            throw new Error('Admins only can deliver');
        }
    }
    return await Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

const deleteShipment = async (id) => {
    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    listShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
