const jwt = require('jsonwebtoken');
const config = require('config');

// Get the JWT secret key from the configuration
const JWT_SECRET_KEY = config.get('jwtSecret');

// Generate a JWT for a given payload
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
};

// Verify and decode a JWT
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    return null; // Token is invalid or expired
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
