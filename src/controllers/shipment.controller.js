const shipmentService = require('../services/shipment.service');

/**
 * Lists shipments for the current user.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
async function list(req, res, next) {
  try {
    const shipments = await shipmentService.listShipmentsForUser(req.user);
    res.json({ success: true, results: shipments.length, data: shipments });
  } catch (error) {
    next(error);
  }
}

/**
 * Gets a shipment by id.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
async function getById(req, res, next) {
  try {
    const shipment = await shipmentService.getShipmentById(req.params.id, req.user);
    res.json({ success: true, data: shipment });
  } catch (error) {
    next(error);
  }
}

/**
 * Creates a shipment for the current user.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
async function create(req, res, next) {
  try {
    const shipment = await shipmentService.createShipment(req.user, req.body);
    res.status(201).json({ success: true, data: shipment });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates a shipment's status.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
async function updateStatus(req, res, next) {
  try {
    const shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.user);
    res.json({ success: true, data: shipment });
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a shipment.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
async function remove(req, res, next) {
  try {
    const result = await shipmentService.deleteShipment(req.params.id, req.user);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  create,
  updateStatus,
  remove
};
