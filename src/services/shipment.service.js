const Shipment = require('../models/Shipment');
const User = require('../models/User');
const { NotFoundError } = require('../utils/errors.util');

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
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new NotFoundError('Shipment not found');
    }
    return shipment;
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
    const doc = await Shipment.findByIdAndUpdate(id, { status }, { new: true });
    if (!doc) {
        throw new NotFoundError('Shipment not found');
    }
    return doc;
}

async function deleteShipment(id) {
    const doc = await Shipment.findByIdAndDelete(id);
    if (!doc) {
        throw new NotFoundError('Shipment not found');
    }
    return doc;
}

module.exports = {
    getShipments: getShipments,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
