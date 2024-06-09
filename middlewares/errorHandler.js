const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.message, { metadata: err });
  res.status(500).json({ message: 'Server Error' });
};