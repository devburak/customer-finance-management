const { createLogger, format, transports } = require('winston');
require('winston-mongodb');
require('dotenv').config();

const logFormat = format.combine(
  format.timestamp(),
  format.printf(({ timestamp, level, message, metadata }) => {
    return `${timestamp} ${level}: ${message} ${metadata ? JSON.stringify(metadata) : ''}`;
  })
);

const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.MongoDB({
      db: process.env.DB_URI,
      options: { useNewUrlParser: true },
      collection: 'logs',
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    })
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.MongoDB({
      db: process.env.DB_URI,
      options: { useNewUrlParser: true },
      collection: 'logs_exceptions',
      level: 'error',
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    })
  ],
  rejectionHandlers: [
    new transports.Console(),
    new transports.MongoDB({
      db: process.env.DB_URI,
      options: { useNewUrlParser: true },
      collection: 'logs_rejections',
      level: 'error',
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    })
  ]
});

module.exports = logger;