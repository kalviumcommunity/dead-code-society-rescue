const shipmentService = require('../services/shipment.service');

const list = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getUserShipments(req.userId);
    res.json({ status: 'success', results: shipments.length, data: shipments });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
    res.json(shipment);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body, req.userId);
    res.status(201).json(shipment);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create };
