const Shipment = require('../models/Shipment');

const getUserShipments = async (userId) => {
    return await Shipment.find({ userId }).populate('userId', 'name email');
};

const getShipmentById = async (id) => {
    return await Shipment.findById(id);
};

const createShipment = async (data, userId) => {
    const { origin, destination, weight, carrier } = data;

    const trackingId =
        'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);

    const shipment = new Shipment({
        origin,
        destination,
        weight,
        carrier,
        trackingId,
        userId,
        status: 'pending'
    });

    return await shipment.save();
};

const updateShipmentStatus = async (id, status) => {
    return await Shipment.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
};

const deleteShipment = async (id) => {
    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    getUserShipments,
    getShipmentById,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};