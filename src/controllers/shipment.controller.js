const shipmentService = require('../services/shipment.service');

/**
 * Creates a new shipment.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const create = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body, req.userId);
    res.status(201).json({ success: true, data: shipment });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves all shipments for the authenticated user.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const getByUser = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getShipmentsByUser(req.userId);
    res.status(200).json({ success: true, data: shipments });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a single shipment by ID.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const getById = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(req.params.id);
    res.status(200).json({ success: true, data: shipment });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates shipment status.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const updateStatus = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      req.body.status,
      req.userId,
      req.userRole,
    );
    res.status(200).json({ success: true, data: shipment });
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a shipment.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const deleteOne = async (req, res, next) => {
  try {
    await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
    res.status(200).json({ success: true, message: 'Shipment deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  getByUser,
  getById,
  updateStatus,
  deleteOne,
};
