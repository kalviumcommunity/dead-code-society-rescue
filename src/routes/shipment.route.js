const express = require("express");

const router = express.Router();

const shipmentController = require("../controllers/shipment.controller");

const auth = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validation.middleware");

const {
    createShipmentSchema,
    updateShipmentSchema
} = require("../validators/shipment.validator");

router.get(
    "/",
    auth,
    shipmentController.getAll
);

router.post(
    "/",
    auth,
    validate(createShipmentSchema),
    shipmentController.create
);

router.patch(
    "/:id/status",
    auth,
    validate(updateShipmentSchema),
    shipmentController.updateStatus
);

module.exports = router;