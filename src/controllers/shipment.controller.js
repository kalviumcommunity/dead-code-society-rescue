const { asyncHandler } = require("../utils/async.util");
const shipmentService = require("../services/shipment.service");

/**
 * Lists shipments for the authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the shipment list response.
 */
const listShipments = asyncHandler(async function listShipments(req, res) {
  const shipments = await shipmentService.listShipments(req.user);
  res.json({
    status: "success",
    results: shipments.length,
    data: shipments,
  });
});

/**
 * Returns a single shipment when the user is allowed to access it.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the shipment response.
 */
const getShipment = asyncHandler(async function getShipment(req, res) {
  const shipment = await shipmentService.getShipmentById(
    req.params.id,
    req.user,
  );
  res.json(shipment);
});

/**
 * Creates a shipment for the authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the created shipment response.
 */
const createShipment = asyncHandler(async function createShipment(req, res) {
  const shipment = await shipmentService.createShipment(req.user.id, req.body);
  res.status(201).json(shipment);
});

/**
 * Updates shipment status.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the updated shipment response.
 */
const updateShipmentStatus = asyncHandler(
  async function updateShipmentStatus(req, res) {
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      req.user,
      req.body.status,
    );
    res.json(shipment);
  },
);

/**
 * Deletes a shipment.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next callback.
 * @returns {Promise<void>} Sends the deletion confirmation response.
 */
const deleteShipment = asyncHandler(async function deleteShipment(req, res) {
  const result = await shipmentService.deleteShipment(req.params.id, req.user);
  res.json(result);
});

module.exports = {
  listShipments,
  getShipment,
  createShipment,
  updateShipmentStatus,
  deleteShipment,
};
