const Shipment = require("../models/Shipment");

const {
    ForbiddenError,
    NotFoundError
} = require("../utils/errors.util");

/**
 * Get Shipments
 */
const getShipments = async (user) => {

    const shipments = await Shipment
        .find({
            userId: user.id
        })
        .populate("userId");

    return shipments;

};

/**
 * Create Shipment
 */
const createShipment = async (body, userId) => {

    const shipment = await Shipment.create({

        ...body,

        trackingId:
            "SHIP-" +
            Date.now(),

        userId,

        status: "pending"

    });

    return shipment;

};

/**
 * Update Shipment
 */
const updateStatus = async (

    shipmentId,

    status,

    role

) => {

    if (
        status === "delivered" &&
        role !== "admin"
    ) {

        throw new ForbiddenError(
            "Only admins can mark delivered"
        );

    }

    const shipment =
        await Shipment.findByIdAndUpdate(

            shipmentId,

            {
                status
            },

            {
                new: true
            }

        );

    if (!shipment) {

        throw new NotFoundError(
            "Shipment not found"
        );

    }

    return shipment;

};

module.exports = {

    getShipments,

    createShipment,

    updateStatus

};