const shipmentService = require('../services/shipment.service');

/**
 * Lists shipments for the authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
const listShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.listShipments(req.user.id);
    res.json({ status: 'success', results: shipments.length, data: shipments });
  } catch (err) {
    next(err);
  }
};

/**
 * Returns a single shipment by id.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
const getShipmentById = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(req.params.id, req.user);
    res.json(shipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Creates a new shipment for the current user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
const createShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body, req.user.id);
    res.status(201).json(shipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Updates shipment status.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
const updateShipmentStatus = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.user);
    res.json(shipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a shipment.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
const deleteShipment = async (req, res, next) => {
  try {
    await shipmentService.deleteShipment(req.params.id, req.user);
    res.json({ message: `Deleted ${req.params.id}` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};
