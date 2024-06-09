// Admin rolü kontrolü
const isAdmin = (req, res, next) => {
    if (req.user.role.name === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied: Admins only' });
  };
  
  // Admin veya kendi bilgileri kontrolü
  const isAdminOrSelf = (req, res, next) => {
    if (req.user.role.name === 'admin' || req.user.id === req.params.id) {
      return next();
    }
    return res.status(403).json({ message: 'Access denied: Admins or self only' });
  };
  
  module.exports = {
    isAdmin,
    isAdminOrSelf
  };