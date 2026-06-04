const shipmentService =
  require('../services/shipment.service')

/**
 * Get all shipments
 */
const getAll = async (
  req,
  res,
  next
) => {
  try {
    const shipments =
      await shipmentService.getAll(
        req.user.id
      )

    return res.status(200).json(
      shipments
    )
  } catch (err) {
    next(err)
  }
}

/**
 * Get shipment by id
 */
const getById = async (
  req,
  res,
  next
) => {
  try {
    const shipment =
      await shipmentService.getById(
        req.params.id,
        req.user
      )

    return res.status(200).json(
      shipment
    )
  } catch (err) {
    next(err)
  }
}

/**
 * Create shipment
 */
const create = async (
  req,
  res,
  next
) => {
  try {
    const shipment =
      await shipmentService.create(
        req.body,
        req.user.id
      )

    return res.status(201).json(
      shipment
    )
  } catch (err) {
    next(err)
  }
}

/**
 * Update shipment status
 */
const updateStatus = async (
  req,
  res,
  next
) => {
  try {
    const shipment =
      await shipmentService.updateStatus(
        req.params.id,
        req.body.status,
        req.user
      )

    return res.status(200).json(
      shipment
    )
  } catch (err) {
    next(err)
  }
}

/**
 * Delete shipment
 */
const remove = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await shipmentService.remove(
        req.params.id,
        req.user
      )

    return res.status(200).json(
      result
    )
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAll,
  getById,
  create,
  updateStatus,
  remove
}