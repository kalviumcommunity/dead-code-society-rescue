const Shipment = require('../models/Shipment');
const User = require('../models/User');

const getUserShipments = async (userId) => {
    const shipments = await Shipment.find({ userId: userId });
    const finalData = [];
    
    if (shipments.length === 0) {
        return { shipments: [] };
    }

    for (let i = 0; i < shipments.length; i++) {
        const ship = shipments[i].toObject();
        // SMELL: [HIGH] N+1 Query Problem. Fetching user inside a loop for each shipment. Use populate() instead.
        const u = await User.findById(ship.userId);
        ship.user_details = u;
        finalData.push(ship);
    }
    
    return {
        status: 'success',
        results: finalData.length,
        data: finalData
    };
};

const getShipmentById = async (id, userId, userRole) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        return { error: 'Not found' };
    }
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
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
    // SMELL: [HIGH] Missing authorization check. Any authenticated user can delete any shipment.
    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    getUserShipments, getShipmentById, createShipment, updateShipmentStatus, deleteShipment
};
