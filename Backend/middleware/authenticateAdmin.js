const jwt = require('jsonwebtoken');
const config = require('../config/default.json'); // Change path if needed
const Admin = require('../models/Admin');

const authenticateAdmin = async (req, res, next) => {
  const token = req.header('token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (!decoded.adminId) {
      return res.status(401).json({ message: 'Invalid token, adminId not found' });
    }

    req.admin = await Admin.findById(decoded.adminId);

    if (!req.admin) {
      return res.status(401).json({ message: 'Invalid token, admin not found' });
    }
    req.user = {
      _id: decoded.userId,
      username: user.name,
      userRole: 'admin',
    };

    next();
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateAdmin;
