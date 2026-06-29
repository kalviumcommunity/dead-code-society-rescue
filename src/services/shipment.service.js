const Shipment = require('../models/Shipment');
const User = require('../models/User');

const listShipments = async (userId) => {
    const shipments = await Shipment.find({ userId: userId });
    // SMELL: [HIGH] N+1 query vulnerability where a user query is executed in a loop for every fetched shipment instead of using Mongoose populate.
    const finalData = [];

    if (shipments.length === 0) {
        return [];
    }

    for (let i = 0; i < shipments.length; i++) {
        const ship = shipments[i].toObject();
        // Calling DB inside a loop is standard right?
        // SMELL: [HIGH] Database query executed inside a loop does not have any catch block, leading to unhandled promise rejections or silent failures.
        try {
            const u = await User.findById(ship.userId);
            ship.user_details = u;
            finalData.push(ship);
        } catch (err) {
            // Silent failure as in the original code
        }
    }
    return finalData;
};

const getShipment = async (id, userId, userRole) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
        throw new Error('Not found');
    }
    
    // check permissions
    if (shipment.userId.toString() !== userId && userRole !== 'admin') {
        throw new Error('No access to this shipment');
    }

    return shipment;
};

const createShipment = async (shipmentData, userId) => {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    
    // Use spread to save time, mongoose will handle validation... maybe
    // SMELL: [HIGH] Mass assignment vulnerability from spreading unvalidated request body into database model.
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
            throw new Error('Admins only can deliver');
        }
    }

    return await Shipment.findByIdAndUpdate(id, { status: status }, { new: true });
};

const deleteShipment = async (id) => {
    // No permission check! Anyone can delete any shipment if they have a token.
    // SMELL: [CRITICAL] Missing access control on delete shipment route, allowing any authenticated user to delete any other user's shipment.
    return await Shipment.findByIdAndDelete(id);
};

module.exports = {
    listShipments,
    getShipment,
    createShipment,
    updateShipmentStatus,
    deleteShipment
};
