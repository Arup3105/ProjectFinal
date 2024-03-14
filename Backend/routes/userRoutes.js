// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const authMiddleware = require('../middleware/authenticate');
const User = require('../models/User');
const Post = require('../models/Post');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const multer = require('multer');
const upload = multer({
  limits: {
    fieldSize: 1024 * 1024 * 20, // Adjust the value as needed (e.g., 20 MB)
  },
});

// User registration
router.post('/register', upload.none(), async (req, res) => {
  try {
    const {
      name,
      rollNumber,
      regNumber,
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
      secondSemMarkSheet,
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
      return res.status(400).json({ message: 'User already exists ' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      rollNumber,
      regNumber,
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
      secondSemMarkSheet,
      thirdSemMarkSheet,
      forthSemMarkSheet,
      fifthSemMarkSheet,
      sixthSemMarkSheet,
      cv,
      stream,
      notifications: [], // Initialize notifications array
    });

    // Save the new user to the database
    await newUser.save();

    const token = jwt.sign(
      {
        userId: newUser._id,
        username: newUser.name,
        rollNumber: newUser.rollNumber,
      },
      config.get('jwtSecret'),
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: 'User registered successfully',token });
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
        const token = jwt.sign(
          {
            userId: user._id,
            username: user.name,
            rollNumber: user.rollNumber,
          },
          config.get('jwtSecret'),
          { expiresIn: '1d' }
        );

        
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

// Forget password - Reset password with roll, name, and phone number
router.post('/forgetPassword', async (req, res) => {
  try {
    const { rollNumber, name, mobileNumber,email,newPassword } = req.body;

    // Check if the user with the provided details exists
    const user = await User.findOne({ rollNumber, name, mobileNumber,email});

    if (user) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password and clear the reset OTP
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password reset initiated successfully' });
    } else {
      res.status(404).json({ message: 'User not found with provided details' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// See posts in feed



// Get notifications for the authenticated user
router.get('/notification', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch unread notifications for the user
    const notifications = await Notification.find({ userId, read: false });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// User profile (requires authentication)
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

// Update user profile (requires authentication)
router.put('/updateProfile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Update user profile data based on the authenticated user
    await User.findByIdAndUpdate(userId, { $set: req.body }, { new: true });

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a comment to a post (requires authentication)
router.post('/addComment/:postId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;
    const { content } = req.body;

    // Create a new comment
    const newComment = new Comment({ userId, postId, content });

    // Save the new comment to the database
    await newComment.save();

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a review to a post (requires authentication)
router.post('/addReview/:postId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;
    const { content } = req.body;

    // Create a new review
    const newReview = new Review({ userId, postId, content });

    // Save the new review to the database
    await newReview.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    // Fetch the authenticated user's notifications
    const userId = req.user._id;

    // Fetch notifications for the user
    const userNotifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(userNotifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
