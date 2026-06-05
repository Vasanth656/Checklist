const service = require("./correctiveAction.service");

// ── helpers ──────────────────────────────────────────────────────────────────

const parseDate = (raw) => (raw ? new Date(raw) : null);

const handleError = (res, error, status = 500) => {
  console.error(error);
  res.status(status).json({ message: error.message || "Something went wrong" });
};

// ── CRUD ─────────────────────────────────────────────────────────────────────

exports.createAction = async (req, res) => {
  try {
    const body = { ...req.body, dueDate: parseDate(req.body.dueDate) };
    const result = await service.create(body);
    res.status(201).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getActions = async (req, res) => {
  try {
    const data = await service.findAll(req.query);
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getAction = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await service.findById(id);
    if (!data) return res.status(404).json({ message: "Action not found" });
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateAction = async (req, res) => {
  try {
    const body = { ...req.body, dueDate: parseDate(req.body.dueDate) };
    const result = await service.update(req.params.id, body);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteAction = async (req, res) => {
  try {
    await service.remove(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

exports.getDashboard = async (req, res) => {
  try {
    const summary = await service.getDashboardSummary();
    res.json(summary);
  } catch (error) {
    handleError(res, error);
  }
};