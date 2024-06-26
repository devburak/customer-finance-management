const User = require('../services/user/models/userModel');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate('role');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { role } = user;

      // SuperAdmin kontrolü
      if (role.isSuperAdmin || role.permissions.includes(requiredPermission)) {
        return next();
      }

      return res.status(403).json({ message: 'Permission denied' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = checkPermission;
