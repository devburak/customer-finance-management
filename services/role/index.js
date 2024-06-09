const express = require('express');
const roleRoutes = require('./routes/roleRoutes');

const roleService = express();
roleService.use('/roles', roleRoutes);

module.exports = roleService;