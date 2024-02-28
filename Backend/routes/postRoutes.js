// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticateUser');
const Post = require('../models/Post');

// Create a new post
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;

    // Create a new post
    const newPost = new Post({
      title,
      content,
      imageUrl,
      // Add other fields as needed
    });

    // Save the post to the database
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all posts
router.get('/all', async (req, res) => {
  try {
    // Retrieve all posts from the database
    const allPosts = await Post.find();

    res.status(200).json(allPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
