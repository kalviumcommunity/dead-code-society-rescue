var shipmentService = require('../services/shipmentService');
var { sendJson } = require('../utils/response');

async function listShipments(req, res, next) {
    try {
        var shipments = await shipmentService.listShipmentsForUser(req.user);
        return sendJson(res, 200, {
            status: 'success',
            results: shipments.length,
            data: shipments
        });
    } catch (error) {
        return next(error);
    }
}

async function getShipment(req, res, next) {
    try {
        var shipment = await shipmentService.getShipmentById(req.params.id, req.user);
        return sendJson(res, 200, shipment);
    } catch (error) {
        return next(error);
    }
}

async function createShipment(req, res, next) {
    try {
        var shipment = await shipmentService.createShipment(req.body, req.user);
        return sendJson(res, 200, shipment);
    } catch (error) {
        return next(error);
    }
}

async function updateShipmentStatus(req, res, next) {
    try {
        var shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.user);
        return sendJson(res, 200, shipment);
    } catch (error) {
        return next(error);
    }
}

async function deleteShipment(req, res, next) {
    try {
        var result = await shipmentService.deleteShipment(req.params.id, req.user);
        return sendJson(res, 200, result);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    listShipments: listShipments,
    getShipment: getShipment,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
