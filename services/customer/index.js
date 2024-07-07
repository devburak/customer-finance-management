const express = require('express');
const customerRoutes = require('./routes/customerRoutes');

const customerService = express();
customerService.use('/customers', customerRoutes);

module.exports = customerService;