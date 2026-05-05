// Shipment controller stub
const Shipment = require('../../models/Shipment');
const User = require('../../models/User');
const { AppError, NotFoundError, UnauthorizedError } = require('../utils/errors.util');

// GET /shipments
/**
 * List all shipments for the authenticated user
 * @route GET /shipments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const listShipments = async (req, res, next) => {
  try {
    // Use populate to avoid N+1 queries
    const shipments = await Shipment.find({ userId: req.userId }).populate('userId');
    if (shipments.length === 0) {
      return res.json({ shipments: [] });
    }
    // Attach user_details as populated userId
    const finalData = shipments.map(ship => {
      const obj = ship.toObject();
      obj.user_details = obj.userId;
      return obj;
    });
    res.json({
      status: 'success',
      results: finalData.length,
      data: finalData
    });
  } catch (err) {
    next(new AppError('Fetch failed', 500));
  }
};

// GET /shipments/:id
/**
 * Get a shipment by ID
 * @route GET /shipments/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return next(new NotFoundError('Shipment not found'));
    }
    if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return next(new UnauthorizedError('No access to this shipment'));
    }
    res.json(shipment);
  } catch (err) {
    next(new AppError('Error on findById', 500));
  }
};

// POST /shipments
/**
 * Create a new shipment
 * @route POST /shipments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createShipment = async (req, res, next) => {
  try {
    const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    const newShipment = new Shipment({
      ...req.body,
      trackingId: trackId,
      userId: req.userId,
      status: 'pending'
    });
    const saved = await newShipment.save();
    res.json(saved);
  } catch (err) {
    next(new AppError('Error saving shipment', 500));
  }
};

// PATCH /shipments/:id/status
/**
 * Update shipment status
 * @route PATCH /shipments/:id/status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateShipmentStatus = async (req, res, next) => {
  if (req.body.status === 'delivered') {
    if (req.userRole !== 'admin') {
      return next(new UnauthorizedError('Admins only can deliver'));
    }
  }
  try {
    const doc = await Shipment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(doc);
  } catch (err) {
    next(new AppError('Update failed', 500));
  }
};

// DELETE /shipments/:id
/**
 * Delete a shipment by ID
 * @route DELETE /shipments/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteShipment = async (req, res, next) => {
  try {
    await Shipment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted ' + req.params.id });
  } catch (e) {
    next(new AppError('Delete error', 500));
  }
};

module.exports = {
  listShipments,
  getShipment,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};
