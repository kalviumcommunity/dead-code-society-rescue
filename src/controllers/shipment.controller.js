const shipmentService = require('../services/shipment.service');

/**
 * Gets all shipments for the current user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getShipmentsByUserId(req.userId);
    res.json({
      status: 'success',
      results: shipments.length,
      data: shipments
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Gets a single shipment by ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getShipmentById = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(
      req.params.id,
      req.userId,
      req.userRole
    );
    res.json(shipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new shipment.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
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
 * Updates the status of a shipment.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateShipmentStatus = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      req.body.status,
      req.userRole
    );
    res.json(shipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a shipment.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteShipment = async (req, res, next) => {
  try {
    const result = await shipmentService.deleteShipment(
      req.params.id,
      req.userId,
      req.userRole
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};
