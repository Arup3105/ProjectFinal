const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const actualToken = token.split(' ')[1];

  try {
    const decoded = jwt.verify(actualToken, config.jwtSecret);

    console.log('Decoded Token:', decoded,); // Log the decoded token to check its contents

    // Fetch user from database using decoded userId
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found for the provided token' });
    }

    // Set the req.user object with decoded information
    req.user = {
      _id: decoded.userId,
      username: decoded.username,
    };

    next();
  } catch (error) {
    console.error('Error decoding token:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateUser;
