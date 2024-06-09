const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../../../middlewares/permissionMiddleware');


router.post('/login', userController.authenticate);
router.post('/refresh-token', userController.refreshToken);

router.get('/', authMiddleware, checkPermission('readUsers'), userController.getAllUsers);
router.get('/:id', authMiddleware, checkPermission('readUser'), userController.getUserById);
router.post('/', authMiddleware, checkPermission('createUser'), userController.createUser);
router.put('/:id', authMiddleware, checkPermission('updateUser'), userController.updateUser);
router.delete('/:id', authMiddleware, checkPermission('deleteUser'), userController.deleteUser);
router.get('/filter', authMiddleware, checkPermission('readUsers'), userController.filterUsers);
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password/:token', userController.resetPassword);

module.exports = router;

