const Review = require('../models/Review');

// Get all reviews for a specific post
const getAllReviewsForPost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Fetch all reviews for the specified post from the database
    const reviewsForPost = await Review.find({ postId });

    res.status(200).json(reviewsForPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Approve a review
const approveReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    // Update the approval status of the review to true in the database
    await Review.findByIdAndUpdate(reviewId, { approved: true });

    res.status(200).json({ message: 'Review approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllReviewsForPost,
  approveReview,
};
