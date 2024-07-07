const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../../user/middlewares/authMiddleware');
const { isAdmin } = require('../../../middlewares/roleMiddleware');
const checkPermission = require('../../../middlewares/permissionMiddleware');

router.get('/monthly-totals', authMiddleware, checkPermission('readTransactions'), transactionController.getMonthlyTotals);
router.get('/', authMiddleware, checkPermission('readTransactions'), transactionController.getTransactions);
router.post('/', authMiddleware, checkPermission('createTransaction'), transactionController.createTransaction);
router.get('/:id', authMiddleware, checkPermission('readTransactions'), transactionController.getTransactionById);
router.put('/:id', authMiddleware, checkPermission('updateTransaction'), transactionController.updateTransaction);
router.delete('/:id', authMiddleware, checkPermission('deleteTransaction'), transactionController.deleteTransaction);
router.get('/balance/:customerId', authMiddleware, checkPermission('readTransactions'), transactionController.getCustomerBalance);

module.exports = router;
