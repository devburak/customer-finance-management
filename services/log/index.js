const express = require('express');
const logRoutes = require('./routes/logRoutes');

const logService = express();
logService.use('/logs', logRoutes);

module.exports = logService;