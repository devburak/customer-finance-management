const authService = require('../services/authService');
const userService = require('../services/userService');
const Token = require('../models/tokenModel');

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = authService.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
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
