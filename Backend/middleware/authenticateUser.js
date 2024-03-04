const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  const token = req.header('token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    console.log('Decoded Token:', decoded,); // Log the decoded token to check its contents

    // Ensure that decoded token contains userId and username
    if (!decoded.userId || !decoded.username) {
      return res.status(401).json({ message: 'Invalid token, user information missing' });
    }

    // Set the req.user object with decoded information
    req.user = {
      _id: decoded.userId,
      username: decoded.username,
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateUser;
