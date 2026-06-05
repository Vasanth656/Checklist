const express = require("express");
const controller = require("./correctiveAction.controller");

const router = express.Router();

router.get("/dashboard", controller.getDashboard); // must be BEFORE /:id
router.get("/",          controller.getActions);
router.post("/",         controller.createAction);
router.get("/:id",       controller.getAction);
router.put("/:id",       controller.updateAction);
router.delete("/:id",    controller.deleteAction);

module.exports = router;