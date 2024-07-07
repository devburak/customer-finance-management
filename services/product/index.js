const express = require('express');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockTransactionRoutes')

const productService = express();
const stockService = express();
productService.use('/products', productRoutes);
stockService.use('/stock-transactions', stockRoutes);

module.exports = {stockService,productService};