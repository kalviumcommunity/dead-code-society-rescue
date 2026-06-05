const shipmentService =
require('../services/shipment.service');

exports.getAll = async (req, res) => {
    const data =
    await shipmentService.getAll(req.userId);

    res.json(data);
};

exports.getOne = async (req, res) => {
    const shipment =
    await shipmentService.getOne(
        req.params.id,
        req.userId,
        req.userRole
    );

    res.json(shipment);
};

exports.create = async (req, res) => {
    const shipment =
    await shipmentService.create(
        req.body,
        req.userId
    );

    res.status(201).json(shipment);
};

exports.updateStatus = async (req, res) => {
    const shipment =
    await shipmentService.updateStatus(
        req.params.id,
        req.body.status,
        req.userRole
    );

    res.json(shipment);
};

exports.remove = async (req, res) => {
    await shipmentService.remove(
        req.params.id,
        req.userId,
        req.userRole
    );

    res.json({
        message: 'Deleted'
    });
};