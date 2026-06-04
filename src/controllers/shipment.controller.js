/**
 * Shipment controller - handles shipment routes
 */

const shipmentService = require('../services/shipment.service');

/**
 * Create a new shipment
 * @param {Object} req - Express request object (must have userId from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const createShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body, req.userId);
    res.status(201).json({
      success: true,
      message: 'Shipment created successfully',
      data: shipment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all shipments for the current user
 * @param {Object} req - Express request object (must have userId from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const getShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getUserShipments(req.userId);
    res.status(200).json({
      success: true,
      data: shipments,
      count: shipments.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific shipment
 * @param {Object} req - Express request object (must have userId, userRole from auth middleware, shipmentId in params)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const getShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipment(
      req.params.id,
      req.userId,
      req.userRole
    );
    res.status(200).json({
      success: true,
      data: shipment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update shipment status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const updateShipmentStatus = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      req.body.status,
      req.userId,
      req.userRole
    );
    res.status(200).json({
      success: true,
      message: 'Shipment status updated',
      data: shipment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a shipment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const deleteShipment = async (req, res, next) => {
  try {
    await shipmentService.deleteShipment(
      req.params.id,
      req.userId,
      req.userRole
    );
    res.status(200).json({
      success: true,
      message: 'Shipment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createShipment,
  getShipments,
  getShipment,
  updateShipmentStatus,
  deleteShipment
};
