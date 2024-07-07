const express = require('express');
const router = express.Router();
const stockTransactionController = require('../controllers/stockTransactionController');
const authMiddleware = require('../../user/middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/permissionMiddleware');

router.post('/', authMiddleware, checkPermission('createStockTransaction'), stockTransactionController.createStockTransaction);
router.get('/', authMiddleware, checkPermission('readStockTransactions'), stockTransactionController.getStockTransactions);
router.get('/:id', authMiddleware, checkPermission('readStockTransactions'), stockTransactionController.getStockTransactionById);
router.put('/:id', authMiddleware, checkPermission('updateStockTransaction'), stockTransactionController.updateStockTransaction);
router.delete('/:id', authMiddleware, checkPermission('deleteStockTransaction'), stockTransactionController.deleteStockTransaction);

module.exports = router;
