const shipmentService = require('../services/shipment.service');
const { sendSuccess } = require('../utils/response.util');

/**
 * Handles shipment list request.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {Promise<void>}
 */
const listShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.listShipments(req.userId);
    sendSuccess(res, 200, { results: shipments.length, shipments });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles get shipment by id request.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {Promise<void>}
 */
const getShipmentById = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
    sendSuccess(res, 200, shipment);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles shipment creation request.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {Promise<void>}
 */
const createShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body, req.userId);
    sendSuccess(res, 201, shipment);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles shipment status update request.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {Promise<void>}
 */
const updateShipmentStatus = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      req.body.status,
      req.userId,
      req.userRole,
    );
    sendSuccess(res, 200, shipment);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles shipment deletion request.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {Promise<void>}
 */
const deleteShipment = async (req, res, next) => {
  try {
    const result = await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
    sendSuccess(res, 200, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment,
};
