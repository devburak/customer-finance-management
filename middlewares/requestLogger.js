const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const referrer = req.headers['referer'] || req.headers['referrer'] || 'N/A';

  const logInfo = {
    method: req.method,
    url: req.url,
    ip: ip,
    referrer: referrer,
  };

  if (req.user) {
    logInfo.user = {
      id: req.user.id,
      role: req.user.role,
      email: req.user.email, // Gerekiyorsa kullanıcı bilgilerini burada ekleyebilirsiniz
    };
  }

  logger.info('Incoming request', logInfo);

  next();
};

module.exports = requestLogger;