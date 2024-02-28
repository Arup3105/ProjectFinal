const Post = require('../models/Post');
const Review = require('../models/Review');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content, imageUrl, targetStream } = req.body;
    const userId = req.user.userId; // Extract user ID from the JWT token

    // Create a new post
    const newPost = new Post({
      title,
      content,
      imageUrl,
      userId,
      targetStream,
    });

    // Save the post to the database
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    // Fetch all posts from the database
    const allPosts = await Post.find();

    res.status(200).json(allPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get post details by ID
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    // Fetch the post details from the database
    const postDetails = await Post.findById(postId);

    if (postDetails) {
      res.status(200).json(postDetails);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Create a new review for a post
const createReview = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId; // Extract user ID from the JWT token
    const postId = req.params.id;

    // Create a new review
    const newReview = new Review({
      content,
      userId,
      postId,
    });

    // Save the review to the database
    await newReview.save();

    res.status(201).json({ message: 'Review created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  createReview,
};
