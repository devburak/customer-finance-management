const Log = require('../models/logModel');

class LogRepository {
  async createLog(log) {
    const newLog = new Log(log);
    return await newLog.save();
  }

  async getAllLogs({ page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'desc' }) {
    const skip = (page - 1) * limit;
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    const logs = await Log.find()
      .populate('user')
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const totalLogs = await Log.countDocuments();

    return {
      logs,
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page
    };
  }

  async filterLogs({ page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'desc', filters }) {
    const skip = (page - 1) * limit;
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

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

    const logs = await Log.find(query)
      .populate('user')
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const totalLogs = await Log.countDocuments(query);

    return {
      logs,
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page
    };
  }

  async deleteLogById(id) {
    return await Log.findByIdAndDelete(id);
  }

  async deleteLogs(query) {
    return await Log.deleteMany(query);
  }
}

module.exports = LogRepository;
