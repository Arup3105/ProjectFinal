const User = require('../models/User');
const Post = require('../models/Post');
const Review = require('../models/Review');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from the JWT token

    // Fetch user profile from the database
    const userProfile = await User.findById(userId, { password: 0 }); // Exclude password from the response

    if (userProfile) {
      res.status(200).json(userProfile);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all posts for the user
const getAllPosts = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from the JWT token

    // Fetch all posts from the database
    const userPosts = await Post.find({ userId });

    res.status(200).json(userPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all reviews for the user
const getAllReviews = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from the JWT token

    // Fetch all reviews from the database
    const userReviews = await Review.find({ userId });

    res.status(200).json(userReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getUserProfile,
  getAllPosts,
  getAllReviews,
};
