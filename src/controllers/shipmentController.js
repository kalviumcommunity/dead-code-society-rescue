const shipmentService = require('../services/shipmentService');
const { sendJson } = require('../utils/response');

async function listShipments(req, res, next) {
    const shipments = await shipmentService.listShipmentsForUser(req.user);
    return sendJson(res, 200, {
        status: 'success',
        results: shipments.length,
        data: shipments
    });
}

async function getShipment(req, res, next) {
    const shipment = await shipmentService.getShipmentById(req.params.id, req.user);
    return sendJson(res, 200, shipment);
}

async function createShipment(req, res, next) {
    const shipment = await shipmentService.createShipment(req.body, req.user);
    return sendJson(res, 201, shipment);
}

async function updateShipmentStatus(req, res, next) {
    const shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.user);
    return sendJson(res, 200, shipment);
}

async function deleteShipment(req, res, next) {
    const result = await shipmentService.deleteShipment(req.params.id, req.user);
    return sendJson(res, 200, result);
}

module.exports = {
    listShipments: listShipments,
    getShipment: getShipment,
    createShipment: createShipment,
    updateShipmentStatus: updateShipmentStatus,
    deleteShipment: deleteShipment
};
