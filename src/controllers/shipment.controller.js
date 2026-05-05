const shipmentService = require('../services/shipment.service');

/**
 * Lists all shipments for the authenticated user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
const listShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.listShipments(req.userId);
    res.status(200).json({
      status: 'success',
      results: shipments.length,
      data: shipments
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Gets a single shipment by ID
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
const getShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipment(
      req.params.id,
      req.userId,
      req.userRole
    );
    res.status(200).json(shipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new shipment
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
const createShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body, req.userId);
    res.status(201).json(shipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Updates shipment status
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
const updateStatus = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      req.body.status,
      req.userRole
    );
    res.status(200).json(shipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a shipment
 * @param {Object} req - Express request
 * @param {Object} res - Express response
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
      message: 'Deleted ' + req.params.id 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listShipments,
  getShipment,
  createShipment,
  updateStatus,
  deleteShipment
};
