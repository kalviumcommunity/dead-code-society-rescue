const shipmentService = require('../services/shipment.service');

/**
 * GET /api/shipments
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {Promise<void>}
 */
const list = async (req, res, next) => {
  try {
    const result = await shipmentService.listByUser(req.userId);
    res.json({ success: true, status: 'success', ...result });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/shipments/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {Promise<void>}
 */
const getOne = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getById(
      req.params.id,
      req.userId,
      req.userRole
    );
    res.json({ success: true, shipment });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/shipments
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {Promise<void>}
 */
const create = async (req, res, next) => {
  try {
    const shipment = await shipmentService.create(req.body, req.userId);
    res.status(201).json({ success: true, shipment });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/shipments/:id/status
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {Promise<void>}
 */
const updateStatus = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateStatus(
      req.params.id,
      req.body.status,
      req.userRole
    );
    res.json({ success: true, shipment });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/shipments/:id
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {Promise<void>}
 */
const remove = async (req, res, next) => {
  try {
    const result = await shipmentService.remove(
      req.params.id,
      req.userId,
      req.userRole
    );
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  getOne,
  create,
  updateStatus,
  remove,
};
