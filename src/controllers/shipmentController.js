const shipmentService = require('../services/shipmentService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Return all shipments belonging to the authenticated user.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const listShipments = asyncHandler(async (req, res) => {
  const shipments = await shipmentService.listShipments(req.user.id);
  res.json({ status: 'success', results: shipments.length, data: shipments });
});

/**
 * Return one shipment when the user is authorized.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const getShipment = asyncHandler(async (req, res) => {
  const shipment = await shipmentService.getShipmentById(req.params.id, req.user.id, req.user.role);
  res.json(shipment);
});

/**
 * Persist a newly created shipment.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const createShipment = asyncHandler(async (req, res) => {
  const shipment = await shipmentService.createShipment(req.body, req.user.id);
  res.status(201).json(shipment);
});

/**
 * Update the status of an existing shipment.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const updateStatus = asyncHandler(async (req, res) => {
  const shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.user.role);
  res.json(shipment);
});

/**
 * Delete an existing shipment.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const deleteShipment = asyncHandler(async (req, res) => {
  const result = await shipmentService.deleteShipment(req.params.id);
  res.json(result);
});

module.exports = {
  listShipments,
  getShipment,
  createShipment,
  updateStatus,
  deleteShipment
};
