const Role = require('../models/roleModel');
const cacheService = require('../../cache/services/cacheService');

class RoleService {
  async getAllRoles() {
    let roles = cacheService.getCache('all_roles');
    if (roles) {
      return roles;
    }
    roles = await Role.find();
    cacheService.setCache('all_roles', roles);
    return roles;
  }

  async createRole(roleData) {
    const role = new Role(roleData);
    const newRole = await role.save();
    
    // Cache'i güncelle
    cacheService.deleteCache('all_roles');

    return newRole;
  }

  async updateRole(roleId, roleData) {
    const role = await Role.findByIdAndUpdate(roleId, roleData, { new: true });
    if (!role) {
      throw new Error('Role not found');
    }

    // Cache'i güncelle
    cacheService.deleteCache('all_roles');

    return role;
  }

  async deleteRole(roleId) {
    const role = await Role.findByIdAndDelete(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Cache'i güncelle
    cacheService.deleteCache('all_roles');

    return role;
  }

  async getRoleById(roleId) {
    let role = cacheService.getCache(`role_${roleId}`);
    if (role) {
      return role;
    }
    role = await Role.findById(roleId);
    if (role) {
      cacheService.setCache(`role_${roleId}`, role);
    }
    return role;
  }

  async getRoleByName(roleName) {
    let role = cacheService.getCache(`role_name_${roleName}`);
    if (role) {
      return role;
    }
    role = await Role.findOne({ name: roleName });
    if (role) {
      cacheService.setCache(`role_name_${roleName}`, role);
    }
    return role;
  }
}

module.exports = new RoleService();
