const shipmentService = require('../services/shipment.service');

/**
 * Retrieves all shipments for the current user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Promise<void>}
 */
const getShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getUserShipments(req.userId);
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
 * Retrieves a single shipment by its ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Promise<void>}
 */
const getShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
    res.json(shipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new shipment.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Promise<void>}
 */
const createShipment = async (req, res, next) => {
  try {
    const newShipment = await shipmentService.createShipment(req.body, req.userId);
    res.status(201).json(newShipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Updates a shipment's status.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Promise<void>}
 */
const updateStatus = async (req, res, next) => {
  try {
    const updatedShipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userId, req.userRole);
    res.json(updatedShipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a shipment.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Promise<void>}
 */
const deleteShipment = async (req, res, next) => {
  try {
    await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
    res.json({ message: `Deleted ${req.params.id}` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getShipments,
  getShipment,
  createShipment,
  updateStatus,
  deleteShipment
};