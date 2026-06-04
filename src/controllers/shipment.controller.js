const shipmentService = require('../services/shipment.service');

const list = async (req, res, next) => {
  try {
    const shipments = await shipmentService.listShipments(req.userId);
    res.status(200).json({
      success: true,
      results: shipments.length,
      data: shipments,
    });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(
      req.params.id,
      req.userId,
      req.userRole
    );
    res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body, req.userId);
    res.status(201).json({
      success: true,
      message: 'Shipment created',
      data: shipment,
    });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      req.body.status,
      req.userId,
      req.userRole
    );
    res.status(200).json({
      success: true,
      message: 'Status updated',
      data: shipment,
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await shipmentService.deleteShipment(
      req.params.id,
      req.userId,
      req.userRole
    );
    res.status(200).json({
      success: true,
      message: `Shipment ${result.id} deleted`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, updateStatus, remove };
