// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  content: String,
  approved: { type: Boolean, default: false },
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
