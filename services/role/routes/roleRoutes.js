const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../../user/middlewares/authMiddleware');
const { isAdmin } = require('../../../middlewares/roleMiddleware');
const checkPermission = require('../../../middlewares/permissionMiddleware');

router.get('/', authMiddleware,  checkPermission('readRoles'), roleController.getAllRoles);
router.post('/', authMiddleware, checkPermission('createRole'), roleController.createRole);
router.put('/:id', authMiddleware, checkPermission('updateRole'), roleController.updateRole);
router.delete('/:id', authMiddleware, checkPermission('deleteRole'), roleController.deleteRole);
router.get('/:id', authMiddleware, checkPermission('readRoles'), roleController.getRoleById);
router.get('/name/:name', authMiddleware, checkPermission('readRoles'), roleController.getRoleByName);
router.get('/permissions', authMiddleware, checkPermission('readRoles'), roleController.getPermissions);
module.exports = router;
