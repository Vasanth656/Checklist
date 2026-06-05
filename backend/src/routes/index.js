const express = require("express");

const templateRoutes = require("../modules/template/template.route");
const correctiveActionRoutes = require("../modules/correctiveAction/correctiveAction.route");

const router = express.Router();

router.use("/templates", templateRoutes);

// MODULE 2
router.use("/actions", correctiveActionRoutes);

module.exports = router;