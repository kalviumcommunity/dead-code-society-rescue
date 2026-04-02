/**
 * @file shipment.controller.js
 * @description Controllers for shipment related operations
 */

const shipmentService = require('../services/shipment.service');

/**
 * Creates a new shipment
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware function
 */
const create = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.user._id, req.body);

    res.status(201).json({
      status: 'success',
      data: { shipment },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Lists all shipments (can be filtered by user if not admin)
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware function
 */
const list = async (req, res, next) => {
  try {
    // Basic filter: only show shipments belonging to the current user (unless admin)
    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const shipments = await shipmentService.listShipments(filter);

    res.status(200).json({
      status: 'success',
      results: shipments.length,
      data: { shipments },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get details of a single shipment
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware function
 */
const getShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentByTracking(req.params.trackingNumber);

    res.status(200).json({
      status: 'success',
      data: { shipment },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates a shipment's detail
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware function
 */
const updateStatus = async (req, res, next) => {
  try {
    const updatedShipment = await shipmentService.updateShipment(
      req.params.trackingNumber,
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: { shipment: updatedShipment },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a shipment
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware function
 */
const remove = async (req, res, next) => {
  try {
    await shipmentService.deleteShipment(req.params.trackingNumber);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  list,
  getShipment,
  updateStatus,
  remove,
};
