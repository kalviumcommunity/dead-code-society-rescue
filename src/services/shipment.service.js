const Shipment = require('../../models/Shipment')
const {
  NotFoundError,
  UnauthorizedError
} = require('../utils/errors.util')

/**
 * Get all shipments for current user
 * Fixes N+1 query using populate()
 */
const getAll = async (userId) => {
  return Shipment.find({
    userId
  }).populate(
    'userId',
    'name email role'
  )
}

/**
 * Get shipment by id
 */
const getById = async (
  shipmentId,
  user
) => {
  const shipment =
    await Shipment.findById(
      shipmentId
    )

  if (!shipment) {
    throw new NotFoundError(
      'Shipment not found'
    )
  }

  if (
    shipment.userId.toString() !==
      user.id &&
    user.role !== 'admin'
  ) {
    throw new UnauthorizedError(
      'No access to shipment'
    )
  }

  return shipment
}

/**
 * Create shipment
 */
const create = async (
  data,
  userId
) => {
  const trackingId =
    `SHIP-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`

  return Shipment.create({
    origin: data.origin,
    destination: data.destination,
    weight: data.weight,
    carrier: data.carrier,
    trackingId,
    userId,
    status: 'pending'
  })
}

/**
 * Update shipment status
 */
const updateStatus = async (
  shipmentId,
  status,
  user
) => {
  if (
    status === 'delivered' &&
    user.role !== 'admin'
  ) {
    throw new UnauthorizedError(
      'Only admins can mark delivered'
    )
  }

  const shipment =
    await Shipment.findByIdAndUpdate(
      shipmentId,
      { status },
      { new: true }
    )

  if (!shipment) {
    throw new NotFoundError(
      'Shipment not found'
    )
  }

  return shipment
}

/**
 * Delete shipment
 */
const remove = async (
  shipmentId,
  user
) => {
  const shipment =
    await Shipment.findById(
      shipmentId
    )

  if (!shipment) {
    throw new NotFoundError(
      'Shipment not found'
    )
  }

  if (
    shipment.userId.toString() !==
      user.id &&
    user.role !== 'admin'
  ) {
    throw new UnauthorizedError(
      'No permission'
    )
  }

  await Shipment.findByIdAndDelete(
    shipmentId
  )

  return {
    message: 'Shipment deleted'
  }
}

module.exports = {
  getAll,
  getById,
  create,
  updateStatus,
  remove
}