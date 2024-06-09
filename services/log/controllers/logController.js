const logService = require('../services/logService');

exports.createLog = async (req, res) => {
  try {
    const log = await logService.createLog(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllLogs = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
      sortField: req.query.sortField || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc'
    };
    const logs = await logService.getAllLogs(options);
    res.json(logs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.filterLogs = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
      sortField: req.query.sortField || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
      filters: req.query
    };
    const logs = await logService.filterLogs(options);
    res.json(logs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLogById = async (req, res) => {
  try {
    await logService.deleteLogById(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLogs = async (req, res) => {
  try {
    const filters = req.body;
    await logService.deleteLogs(filters);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};