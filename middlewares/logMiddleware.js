const logger = require('../utils/logger');
const logService = require('../services/log/services/logService');
const logMiddleware = (req, res, next) => {
    const user = req.user; // Auth middleware'den gelen kullanıcı bilgisi
    const forwardedIps = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',') : [];
    const ip = forwardedIps.length ? forwardedIps[0] : req.connection.remoteAddress;
    const action = `${req.method} ${req.originalUrl}`;
    const details = `Request body: ${JSON.stringify(req.body)}`;
  
    logService.createLog(action, user ? user._id : null, ip, details)
      .then(() => {
        logger.info('Log created successfully', { action, user: user ? user._id : null, ip, details });
      })
      .catch((error) => {
        console.error('Error creating log:', error); // Hata mesajını konsola yazdır
        logger.error('Error creating log', { error });
      });
  
    next();
  };
  
  module.exports = logMiddleware;