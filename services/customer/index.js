const express = require('express');
const customerRoutes = require('./routes/customerRoutes');

const customerService = express();
customerService.use('/customer', customerRoutes);

module.exports = customerService;