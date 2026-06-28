const express = require("express");

const router = express.Router();

router.use(
    "/auth",
    require("./auth.routes")
);

router.use(
    "/shipments",
    require("./shipment.routes")
);

router.use(
    "/users",
    require("./user.routes")
);

router.get("/status", (req, res) => {
    res.json({
        success: true,
        message: "API Running"
    });
});

router.get("/ping", (req, res) => {
    res.json({
        pong: "active"
    });
});

module.exports = router;