const shipmentService = require('../services/shipment.service');

/**
 * Get all shipments for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getShipments(req.userId, req.userRole);

    res.status(200).json({
      success: true,
      results: shipments.length,
      data: shipments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single shipment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(
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
 * Create a new shipment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
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
 * Update shipment status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
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
      message: 'Shipment status updated successfully',
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
 * @param {Function} next - Express next function
 */
const deleteShipment = async (req, res, next) => {
  try {
    await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);

    res.status(200).json({
      success: true,
      message: 'Shipment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShipments,
  getShipment,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};