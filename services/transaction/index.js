const express = require('express');
const transactionRoutes = require('./routes/transactionRoutes');

const transactionService = express();
transactionService.use('/transactions', transactionRoutes);

module.exports = transactionService;