const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");

const userController = require("../controllers/user.controller");

router.get(
    "/profile",
    auth,
    userController.profile
);

module.exports = router;