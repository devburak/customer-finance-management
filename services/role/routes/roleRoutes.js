const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../../user/middlewares/authMiddleware');
const { isAdmin } = require('../../../middlewares/roleMiddleware');

router.get('/', authMiddleware, isAdmin, roleController.getAllRoles);
router.post('/', authMiddleware, isAdmin, roleController.createRole);
router.put('/:id', authMiddleware, isAdmin, roleController.updateRole);
router.delete('/:id', authMiddleware, isAdmin, roleController.deleteRole);
router.get('/:id', authMiddleware, isAdmin, roleController.getRoleById);
router.get('/name/:name', authMiddleware, isAdmin, roleController.getRoleByName);

module.exports = router;
