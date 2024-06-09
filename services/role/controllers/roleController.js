const roleService = require('../services/roleService');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const role = await roleService.createRole(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    res.json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await roleService.deleteRole(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    res.json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getRoleByName = async (req, res) => {
  try {
    const role = await roleService.getRoleByName(req.params.name);
    res.json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
