const shipmentService = require("../services/shipment.service");

/**
 * Get all shipments for logged-in user
 */
const getAllShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getAllShipments(
      req.user.id
    );

    res.status(200).json({
      success: true,
      count: shipments.length,
      data: shipments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get shipment by ID
 */
const getShipmentById = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create shipment
 */
const createShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update shipment status
 */
const updateShipmentStatus = async (req, res, next) => {
  try {
    const shipment =
      await shipmentService.updateShipmentStatus(
        req.params.id,
        req.body.status,
        req.user.role
      );

    res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete shipment
 */
const deleteShipment = async (req, res, next) => {
  try {
    await shipmentService.deleteShipment(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: "Shipment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment,
};