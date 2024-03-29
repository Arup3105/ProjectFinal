const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const User = require('../models/User');
const Admin = require('../models/Admin');

const authenticate = async (req, res, next) => {
  const rawToken = req.header('Authorization') || req.header('token');
  //console.log("received ")
  if (!rawToken || !rawToken.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = rawToken.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (decoded.userId) {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found for the provided token' });
      }

      req.user = {
        _id: decoded.userId,
        username: user.name,
        stream: user.stream,
        userRole: 'user',
      };
    } else if (decoded.adminId) {
      const admin = await Admin.findById(decoded.adminId);
      if (!admin) {
        return res.status(401).json({ message: 'Admin not found for the provided token' });
      }

      req.user = {
        _id: decoded.adminId,
        username: admin.username,
        userRole: 'admin',
      };
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user.isAdmin = req.user.userRole === 'admin';

    next();
  } catch (error) {
    console.error('Error during token verification:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
