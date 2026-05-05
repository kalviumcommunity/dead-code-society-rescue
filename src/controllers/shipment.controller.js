const shipmentService = require('../services/shipment.service');
const asyncHandler = require('../middlewares/async.middleware');

/**
 * Creates a new shipment.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const create = asyncHandler(async (req, res) => {
  const shipment = await shipmentService.createShipment(req.body, req.userId);
  res.status(201).json({ success: true, data: shipment });
});

/**
 * Retrieves all shipments for the authenticated user.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const getByUser = asyncHandler(async (req, res) => {
  const shipments = await shipmentService.getShipmentsByUser(req.userId);
  res.status(200).json({ success: true, data: shipments });
});

/**
 * Retrieves a single shipment by ID.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const getById = asyncHandler(async (req, res) => {
  const shipment = await shipmentService.getShipmentById(req.params.id);
  res.status(200).json({ success: true, data: shipment });
});

/**
 * Updates shipment status.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const updateStatus = asyncHandler(async (req, res) => {
  const shipment = await shipmentService.updateShipmentStatus(
    req.params.id,
    req.body.status,
    req.userId,
    req.userRole,
  );
  res.status(200).json({ success: true, data: shipment });
});

/**
 * Deletes a shipment.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const deleteOne = asyncHandler(async (req, res) => {
  await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
  res.status(200).json({ success: true, message: 'Shipment deleted' });
});

module.exports = {
  create,
  getByUser,
  getById,
  updateStatus,
  deleteOne,
};
