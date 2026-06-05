const templateService = require("./template.service");

exports.createTemplate = async (req, res) => {
  try {
    const template =
      await templateService.create(req.body);

    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getTemplates = async (req, res) => {
  const templates =
    await templateService.findAll();

  res.json(templates);
};

exports.getTemplate = async (req, res) => {
  const template =
    await templateService.findById(
      req.params.id
    );

  res.json(template);
};

exports.updateTemplate = async (req, res) => {
  const updated =
    await templateService.update(
      req.params.id,
      req.body
    );

  res.json(updated);
};

exports.deleteTemplate = async (req, res) => {
  await templateService.remove(
    req.params.id
  );

  res.json({
    message: "Deleted",
  });
};