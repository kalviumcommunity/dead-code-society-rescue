const Shipment = require("../../models/Shipment");

const {
  NotFoundError,
  UnauthorizedError,
} = require("../utils/errors.util");

/**
 * Get all shipments
 * N+1 FIX -> populate()
 */
const getAllShipments = async (userId) => {
  const shipments = await Shipment.find({
    userId,
  }).populate(
    "userId",
    "name email role"
  );

  return shipments;
};

/**
 * Get shipment by id
 */
const getShipmentById = async (
  shipmentId,
  userId,
  role
) => {
  const shipment =
    await Shipment.findById(
      shipmentId
    ).populate(
      "userId",
      "name email role"
    );

  if (!shipment) {
    throw new NotFoundError(
      "Shipment not found"
    );
  }

  if (
    shipment.userId._id.toString() !== userId &&
    role !== "admin"
  ) {
    throw new UnauthorizedError(
      "Access denied"
    );
  }

  return shipment;
};

/**
 * Create shipment
 */
const createShipment = async (
  shipmentData,
  userId
) => {
  const trackingId =
    "SHIP-" +
    Date.now() +
    "-" +
    Math.floor(
      Math.random() * 1000
    );

  const shipment =
    await Shipment.create({
      trackingId,
      origin: shipmentData.origin,
      destination:
        shipmentData.destination,
      weight: shipmentData.weight,
      carrier: shipmentData.carrier,
      status: "pending",
      userId,
    });

  return shipment;
};

/**
 * Update shipment status
 */
const updateShipmentStatus =
  async (
    shipmentId,
    status,
    role
  ) => {
    if (
      status === "delivered" &&
      role !== "admin"
    ) {
      throw new UnauthorizedError(
        "Only admins can mark as delivered"
      );
    }

    const shipment =
      await Shipment.findByIdAndUpdate(
        shipmentId,
        { status },
        {
          new: true,
          runValidators: true,
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
 * Delete shipment
 */
const deleteShipment = async (
  shipmentId,
  userId,
  role
) => {
  const shipment =
    await Shipment.findById(
      shipmentId
    );

  if (!shipment) {
    throw new NotFoundError(
      "Shipment not found"
    );
  }

  if (
    shipment.userId.toString() !==
      userId &&
    role !== "admin"
  ) {
    throw new UnauthorizedError(
      "You cannot delete this shipment"
    );
  }

  await Shipment.findByIdAndDelete(
    shipmentId
  );
};

module.exports = {
  getAllShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment,
};