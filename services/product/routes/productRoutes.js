const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../../user/middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/permissionMiddleware');

router.post('/', authMiddleware, checkPermission('createProduct'), productController.createProduct);
router.get('/', authMiddleware, checkPermission('readProducts'), productController.getProducts);
router.get('/:id', authMiddleware, checkPermission('readProducts'), productController.getProductById);
router.put('/:id', authMiddleware, checkPermission('updateProduct'), productController.updateProduct);
router.delete('/:id', authMiddleware, checkPermission('deleteProduct'), productController.deleteProduct);

module.exports = router;
