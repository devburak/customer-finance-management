const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const authMiddleware = require('../../user/middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/permissionMiddleware');

router.get('/', authMiddleware, checkPermission('readLogs'), logController.getAllLogs);
router.get('/filter', authMiddleware, checkPermission('readLogs'), logController.filterLogs);
router.delete('/:id', authMiddleware, checkPermission('deleteLog'), logController.deleteLogById); 
router.delete('/', authMiddleware, checkPermission('deleteLog'), logController.deleteLogs); 

module.exports = router;