const express = require('express');
const userRoutes = require('./routes/userRoutes');

const userService = express();
userService.use('/users', userRoutes);

module.exports = userService;