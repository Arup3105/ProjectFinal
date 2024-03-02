const jwt = require('jsonwebtoken');
const config = require('../config/default.json'); // Change path if needed
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  const token = req.header('token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = await User.findById(decoded.userId);

    if (!req.user) {
      return res.status(401).json({ message: 'Invalid token, user not found' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateUser;
