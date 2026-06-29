// ADDED: Shipment controller mapping request endpoints to shipment service functions.
const shipmentService = require('../services/shipment.service');
const { sendSuccess } = require('../utils/response.util');

/**
 * Handle listing of user's shipments.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next handler
 */
const list = async (req, res, next) => {
  try {
    const data = await shipmentService.listShipments(req.userId);
    // Maintain legacy interface where empty lists return a different structure
    if (data.length === 0) {
      return sendSuccess(res, { shipments: [] });
    }
    return sendSuccess(res, {
      status: 'success',
      results: data.length,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle retrieving a specific shipment by ID.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next handler
 */
const getById = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(
      req.params.id,
      req.userId,
      req.userRole
    );
    return sendSuccess(res, shipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Handle creating a new shipment.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next handler
 */
const create = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body, req.userId);
    return sendSuccess(res, shipment, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Handle updating shipment status.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next handler
 */
const updateStatus = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      req.body.status,
      req.userId,
      req.userRole
    );
    return sendSuccess(res, shipment);
  } catch (err) {
    next(err);
  }
};

/**
 * Handle deleting a shipment.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next handler
 */
const remove = async (req, res, next) => {
  try {
    await shipmentService.deleteShipment(
      req.params.id,
      req.userId,
      req.userRole
    );
    return sendSuccess(res, { message: `Deleted ${req.params.id}` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  getById,
  create,
  updateStatus,
  remove
};
