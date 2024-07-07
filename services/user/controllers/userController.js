const userService = require('../services/userService');
const authService = require('../services/authService');
const Token = require('../models/tokenModel');

// Tüm kullanıcıları getirme (filtreleme, sıralama, limit ve sayfalama ile)
exports.getUsers = async (req, res) => {
  try {
    const { globalFilter, sortField, sortOrder, limit, page, ...filters } = req.query;

    const options = {
      sortField,
      sortOrder,
      limit: parseInt(limit),
      page: parseInt(page),
      globalFilter
    };

    const { users, total, page: currentPage, limit: currentLimit } = await userService.getUsers(filters, options);
    res.status(200).json({ users, total, page: currentPage, limit: currentLimit });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body, req.user.id);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticate(email, password);

    const accessToken = authService.generateAccessToken(user);
    const refreshToken = authService.generateRefreshToken(user);

    const newToken = new Token({ token: refreshToken });
    await newToken.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = authService.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log(decoded)
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await userService.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingToken = await Token.findOne({ token: refreshToken });
    if (!existingToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = authService.generateAccessToken(user);
    const newRefreshToken = authService.generateRefreshToken(user);

    existingToken.token = newRefreshToken;
    await existingToken.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.filterUsers = async (req, res) => {
  try {
    const users = await userService.filterUsers(req.query);
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id, req.user.id);
    res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    await userService.requestPasswordReset(req.body.email);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    await userService.resetPassword(req.params.token, req.body.password);
    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
