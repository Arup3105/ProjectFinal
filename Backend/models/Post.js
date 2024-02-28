// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageUrl: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetedStreams: [{ type: String }], // Array of targeted streams
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
