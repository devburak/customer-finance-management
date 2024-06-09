const LogRepository = require('../repositories/logRepository');
const logRepository = new LogRepository();

const createLog = async (action, user, ip, details) => {
  const log = {
    action,
    user,
    ip,
    details
  };
  return await logRepository.createLog(log);
};

const getAllLogs = async (options) => {
  return await logRepository.getAllLogs(options);
};

const filterLogs = async (options) => {
  return await logRepository.filterLogs(options);
};

const deleteLogById = async (id) => {
  return await logRepository.deleteLogById(id);
};

const deleteLogs = async (filters) => {
  const query = {};

  if (filters.action) {
    query.action = { $regex: filters.action, $options: 'i' }; // Case-insensitive regex
  }
  if (filters.userId) {
    query.user = filters.userId;
  }
  if (filters.startDate && filters.endDate) {
    query.createdAt = { $gte: new Date(filters.startDate), $lte: new Date(filters.endDate) };
  }

  return await logRepository.deleteLogs(query);
};

module.exports = {
  createLog,
  getAllLogs,
  filterLogs,
  deleteLogById,
  deleteLogs
};
