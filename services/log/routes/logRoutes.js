const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const authMiddleware = require('../../user/middlewares/authMiddleware');
const { isAdmin } = require('../../../middlewares/roleMiddleware');

router.get('/', authMiddleware, isAdmin, logController.getAllLogs);
router.get('/filter', authMiddleware, isAdmin, logController.filterLogs);
router.delete('/:id', authMiddleware, isAdmin, logController.deleteLogById); // ID'ye göre silme
router.delete('/', authMiddleware, isAdmin, logController.deleteLogs); // Toplu silme

module.exports = router;