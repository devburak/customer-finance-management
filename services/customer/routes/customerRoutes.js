const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController'); // Doğru dosya yolunu ekleyin
const authMiddleware = require('../../user/middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/permissionMiddleware');

router.get('/summary/:customerId', authMiddleware, checkPermission('readCustomers'), customerController.getCustomerSummary);
router.get('/', authMiddleware, checkPermission('readCustomers'), customerController.getAllCustomers);
router.post('/', authMiddleware, checkPermission('createCustomer'), customerController.createCustomer);
router.get('/:id', authMiddleware, checkPermission('readCustomers'), customerController.getCustomerById);
router.put('/:id', authMiddleware, checkPermission('updateCustomer'), customerController.updateCustomer);
router.delete('/:id', authMiddleware, checkPermission('deleteCustomer'), customerController.deleteCustomer);


module.exports = router;
