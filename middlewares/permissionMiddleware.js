const Role = require('../services/role/models/roleModel');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userRole = await Role.findById(req.user.role);
      if (!userRole) {
        return res.status(403).json({ message: 'Role not found' });
      }
      if (userRole.permissions.includes(requiredPermission)) {
        return next();
      } else {
        return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

module.exports = checkPermission;
