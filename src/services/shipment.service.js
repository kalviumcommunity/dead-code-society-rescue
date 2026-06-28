const Shipment = require("../models/Shipment");

const {
    ForbiddenError,
    NotFoundError
} = require("../utils/errors.util");

/**
 * Retrieves all shipments owned by the given user, with the owner populated.
 * @param {Object} user - The authenticated user object from the request (req.user)
 * @param {string} user.id - The user's MongoDB ObjectId as a string
 * @returns {Promise<Array<Object>>} Array of shipment documents with `user` populated
 */
const getShipments = async (user) => {

    const shipments = await Shipment
        .find({
            user: user.id
        })
        .populate("user");

    return shipments;

};

/**
 * Creates a new shipment owned by the given user, generating a unique tracking number.
 * @param {Object} body - Validated shipment payload
 * @param {string} body.origin - Shipment origin location
 * @param {string} body.destination - Shipment destination location
 * @param {number} body.weight - Shipment weight (must be positive)
 * @param {string} body.carrier - Carrier handling the shipment
 * @param {string} userId - MongoDB ObjectId of the user creating the shipment
 * @returns {Promise<Object>} The newly created shipment document
 */
const createShipment = async (body, userId) => {

    const shipment = await Shipment.create({

        ...body,

        trackingNumber: `SHIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,

        user: userId,

        status: "pending"

    });

    return shipment;

};

/**
 * Updates a shipment's status. Marking a shipment as "delivered" is restricted to admins.
 * @param {string} shipmentId - MongoDB ObjectId of the shipment to update
 * @param {string} status - New status; one of "pending", "in_transit", "delivered"
 * @param {string} role - Role of the requesting user ("user" or "admin")
 * @returns {Promise<Object>} The updated shipment document
 * @throws {ForbiddenError} If a non-admin attempts to set status to "delivered"
 * @throws {NotFoundError} If no shipment exists with the given id
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

/**
 * Retrieves a single shipment by id, with the owner populated.
 * Only the shipment's owner or an admin may view it.
 * @param {string} shipmentId - MongoDB ObjectId of the shipment to retrieve
 * @param {Object} user - The authenticated user object from the request (req.user)
 * @param {string} user.id - The user's MongoDB ObjectId as a string
 * @param {string} user.role - The user's role ("user" or "admin")
 * @returns {Promise<Object>} The matched shipment document
 * @throws {NotFoundError} If no shipment exists with the given id
 * @throws {ForbiddenError} If the requesting user is neither the owner nor an admin
 */
const getShipmentById = async (shipmentId, user) => {

    const shipment = await Shipment
        .findById(shipmentId)
        .populate("user");

    if (!shipment) {

        throw new NotFoundError("Shipment not found");

    }

    const isOwner = shipment.user._id.toString() === user.id;

    if (!isOwner && user.role !== "admin") {

        throw new ForbiddenError("You do not have access to this shipment");

    }

    return shipment;

};

/**
 * Deletes a shipment by id. Only the shipment's owner or an admin may delete it.
 * @param {string} shipmentId - MongoDB ObjectId of the shipment to delete
 * @param {Object} user - The authenticated user object from the request (req.user)
 * @param {string} user.id - The user's MongoDB ObjectId as a string
 * @param {string} user.role - The user's role ("user" or "admin")
 * @returns {Promise<void>}
 * @throws {NotFoundError} If no shipment exists with the given id
 * @throws {ForbiddenError} If the requesting user is neither the owner nor an admin
 */
const removeShipment = async (shipmentId, user) => {

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {

        throw new NotFoundError("Shipment not found");

    }

    const isOwner = shipment.user.toString() === user.id;

    if (!isOwner && user.role !== "admin") {

        throw new ForbiddenError("You do not have access to this shipment");

    }

    await Shipment.findByIdAndDelete(shipmentId);

};

module.exports = {

    getShipments,

    getShipmentById,

    createShipment,

    updateStatus,

    removeShipment

};