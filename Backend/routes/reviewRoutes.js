// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticateUser');
const Review = require('../models/Review');

// Create a new review
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { postId, content } = req.body;

    // Create a new review
    const newReview = new Review({
      postId,
      content,
      userId: req.user._id, // Assuming you have user information in the request after authentication
      // Add other fields as needed
    });

    // Save the review to the database
    await newReview.save();

    res.status(201).json({ message: 'Review created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all reviews (for admin approval)
router.get('/all', async (req, res) => {
  try {
    // Retrieve all reviews from the database
    const allReviews = await Review.find();

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
