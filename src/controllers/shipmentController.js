const Shipment = require('../models/Shipment');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * List shipments for the authenticated user.
 */
const listShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find({ userId: req.user.id })
    .populate('userId', 'name email role')
    .lean();

  const data = shipments.map((shipment) => ({
    ...shipment,
    userId: shipment.userId && shipment.userId._id ? shipment.userId._id : shipment.userId,
    user_details: shipment.userId,
  }));

  return res.json({
    status: 'success',
    results: data.length,
    data,
  });
});

/**
 * Get a single shipment by id.
 */
const getShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id).lean();

  if (!shipment) {
    throw new AppError('Shipment not found', 404);
  }

  if (shipment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('No access to this shipment', 403);
  }

  return res.json(shipment);
});

/**
 * Create a new shipment.
 */
const createShipment = asyncHandler(async (req, res) => {
  const trackId = `SHIP-${Date.now()}-${Math.floor(Math.random() * 100)}`;

  const shipment = await Shipment.create({
    origin: req.body.origin,
    destination: req.body.destination,
    weight: req.body.weight,
    carrier: req.body.carrier,
    trackingId: trackId,
    userId: req.user.id,
    status: 'pending',
  });

  return res.status(201).json(shipment);
});

/**
 * Update shipment status.
 */
const updateShipmentStatus = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    throw new AppError('Shipment not found', 404);
  }

  if (shipment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('No access to this shipment', 403);
  }

  if (req.body.status === 'delivered' && req.user.role !== 'admin') {
    throw new AppError('Admins only can deliver', 403);
  }

  shipment.status = req.body.status;
  await shipment.save();

  return res.json(shipment);
});

/**
 * Delete a shipment.
 */
const deleteShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    throw new AppError('Shipment not found', 404);
  }

  if (shipment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('No access to this shipment', 403);
  }

  await shipment.deleteOne();

  return res.json({ message: `Deleted ${req.params.id}` });
});

module.exports = {
  listShipments,
  getShipment,
  createShipment,
  updateShipmentStatus,
  deleteShipment,
};
