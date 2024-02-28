// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const authMiddleware = require('../middleware/authenticateUser');
const User = require('../models/User');

// User registration
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      rollNumber,
      password,
      email,
      mobileNumber,
      address,
      photo,
      tenthMarks,
      tenthMarkSheet,
      twelfthMarks,
      twelfthMarkSheet,
      cgpa,
      firstSemMarkSheet,
      secndSemMarkSheet,
      thirdSemMarkSheet,
      forthSemMarkSheet,
      fifthSemMarkSheet,
      sixthSemMarkSheet,
      cv,
      stream,
    } = req.body;

    // Check if the rollNumber is unique
    const existingUser = await User.findOne({ rollNumber });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this roll number' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      rollNumber,
      password: hashedPassword,
      email,
      mobileNumber,
      address,
      photo,
      tenthMarks,
      tenthMarkSheet,
      twelfthMarks,
      twelfthMarkSheet,
      cgpa,
      firstSemMarkSheet,
      secndSemMarkSheet,
      thirdSemMarkSheet,
      forthSemMarkSheet,
      fifthSemMarkSheet,
      sixthSemMarkSheet,
      cv,
      stream,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    // Fetch user credentials from the database based on the rollNumber
    const user = await User.findOne({ rollNumber });

    if (user) {
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Generate a JWT token for authentication
        const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'), { expiresIn: '1h' });

        res.status(200).json({ message: 'User login successful', token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get user profile (requires authentication)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Fetch user profile data based on the authenticated user
    const userProfile = await User.findById(req.user._id).select('-password');

    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
