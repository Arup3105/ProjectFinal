// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticateUser');
const Review = require('../models/Review');

// Create a new review
router.post('/addreview', authMiddleware, async (req, res) => {
  try {
    const { postId, content } = req.body;

    // Ensure the req.user object contains the username property
    if (!req.user || !req.user.username) {
      return res.status(401).json({ message: 'Invalid user information' });
    }

    // Get the username from the authenticated user
    const username = req.user.username;

    // Create a new review
    const newReview = new Review({
      username,
      postId,
      content,
    });

    // Save the review to the database
    await newReview.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Get all reviews (for admin approval)
router.get('/all',authMiddleware, async (req, res) => {
  try {
    // Retrieve all reviews from the database
    const allReviews = await Review.find({ approved: true });

    res.status(200).json(allReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Approve a review
router.post('/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Update the review to mark it as approved
    await Review.findByIdAndUpdate(id, { approved: true });

    res.status(200).json({ message: 'Review approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
