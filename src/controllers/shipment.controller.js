const shipmentService = require('../services/shipment.service')

exports.getAll = async (req, res, next) => {
  try {
    const data = await shipmentService.getAll(req.userId)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

exports.getOne = async (req, res, next) => {
  try {
    const data = await shipmentService.getOne(req.params.id, req.userId, req.userRole)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const data = await shipmentService.create(req.body, req.userId)
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
}

exports.updateStatus = async (req, res, next) => {
  try {
    const data = await shipmentService.updateStatus(
      req.params.id,
      req.body.status,
      req.userId,
      req.userRole
    )
    res.json(data)
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const data = await shipmentService.delete(req.params.id, req.userId)
    res.json(data)
  } catch (err) {
    next(err)
  }
}