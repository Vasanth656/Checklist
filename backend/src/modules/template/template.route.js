const express = require("express");

const controller = require(
  "./template.controller"
);

const router = express.Router();

router.post("/", controller.createTemplate);

router.get("/", controller.getTemplates);

router.get("/:id", controller.getTemplate);

router.put("/:id", controller.updateTemplate);

router.delete("/:id", controller.deleteTemplate);

module.exports = router;