const jwt = require('jsonwebtoken');
const config = require('../config/default.json'); // Change path if needed
const Admin = require('../models/Admin');

const authenticateAdmin = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    req.admin = await Admin.findById(decoded.adminId);

    if (!req.admin) {
      return res.status(401).json({ message: 'Invalid token, admin not found' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateAdmin;
