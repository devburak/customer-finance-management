const express = require('express');
const router = express.Router();
const cacheService = require('../services/cacheService');
const authMiddleware = require('../../user/middlewares/authMiddleware');
const {isAdmin,isAdminOrSelf} = require('../../../middlewares/roleMiddleware');
const checkPermission = require('../../../middlewares/permissionMiddleware');

router.delete('/cache', authMiddleware, checkPermission('flushCache'), (req, res) => {
  cacheService.flushCache();
  res.status(200).json({ message: 'All cache cleared' });
});

module.exports = router;
