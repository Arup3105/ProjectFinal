const jwt = require('jsonwebtoken');
const config = require('config');

const JWT_SECRET_KEY = config.get('jwtSecret');

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
