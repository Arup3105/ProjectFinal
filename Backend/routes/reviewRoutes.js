const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticate');
const Review = require('../models/PlacedStudent');


router.post('/addreview', authMiddleware, async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!req.user || !req.user.username) {
      return res.status(401).json({ message: 'Invalid user information' });
    }
    const username = req.user.username;
    const newReview = new Review({
      username,
      postId,
      content,
    });

    await newReview.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
