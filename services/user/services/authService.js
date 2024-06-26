const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
  const signed = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  console.log(signed ,process.env.JWT_SECRET,user)
  return signed;
};

const generateRefreshToken =  (user) => {
    const signed =  jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    console.log(signed,process.env.REFRESH_TOKEN_SECRET , user)
    return signed;
};

const verifyToken = (token, secret) => {
  try {
    console.log(token)
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Token verification failed');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
};
