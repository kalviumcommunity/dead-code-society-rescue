var Shipment = require('../models/Shipment');
var { sanitizeUser } = require('./authService');

function createError(status, message) {
    var error = new Error(message);
    error.status = status;
    return error;
}

function canAccessShipment(shipment, user) {
    return user.role === 'admin' || shipment.userId.toString() === String(user.id);
}

function normalizeShipment(shipment) {
    var record = shipment.toObject();

    if (record.userId && record.userId._id) {
        record.user_details = sanitizeUser(record.userId);
        record.userId = record.userId._id;
    }

    return record;
}

function buildTrackingId() {
    return 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

async function listShipmentsForUser(user) {
    var shipments = await Shipment.find({ userId: user.id }).populate('userId');
    return shipments.map(normalizeShipment);
}

async function getShipmentById(id, user) {
    var shipment = await Shipment.findById(id).populate('userId');

    if (!shipment) {
        throw createError(404, 'Not found');
    }

    if (!canAccessShipment(shipment, user)) {
        throw createError(403, 'No access to this shipment');
    }

    return normalizeShipment(shipment);
}

async function createShipment(payload, user) {
    var shipment = new Shipment({
        origin: payload.origin,
        destination: payload.destination,
        weight: payload.weight,
        carrier: payload.carrier,
        trackingId: buildTrackingId(),
        userId: user.id,
        status: 'pending'
    });

    return shipment.save();
}

async function updateShipmentStatus(id, status, user) {
    var shipment = await Shipment.findById(id);

    if (!shipment) {
        throw createError(404, 'Not found');
    }

    if (!canAccessShipment(shipment, user)) {
        throw createError(403, 'No access to this shipment');
    }

    if (status === 'delivered' && user.role !== 'admin') {
        throw createError(403, 'Admins only can deliver');
    }

    shipment.status = status;
    return shipment.save();
}

async function deleteShipment(id, user) {
    var shipment = await Shipment.findById(id);

    if (!shipment) {
        throw createError(404, 'Not found');
    }

    if (!canAccessShipment(shipment, user)) {
        throw createError(403, 'No access to this shipment');
    }

    await Shipment.deleteOne({ _id: id });
    return {
        message: 'Deleted ' + id
    };
}

module.exports = {
    listShipmentsForUser: listShipmentsForUser,
    getShipmentById: getShipmentById,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
