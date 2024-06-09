const Role = require('../models/roleModel');

class RoleRepository {
  async getAllRoles() {
    return await Role.find();
  }

  async getRoleByName(name) {
    return await Role.findOne({ name });
  }

  async createRole(role) {
    const newRole = new Role(role);
    return await newRole.save();
  }

  async updateRole(id, role) {
    return await Role.findByIdAndUpdate(id, role, { new: true });
  }

  async deleteRole(id) {
    return await Role.findByIdAndDelete(id);
  }
}

module.exports = RoleRepository;