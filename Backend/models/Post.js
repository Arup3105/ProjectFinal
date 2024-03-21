const mongoose = require('mongoose');

// Function to get the current IST time
const getCurrentISTTime = () => {
  const istOffset = 330; // Offset in minutes for Indian Standard Time
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset * 60000);
  return istTime;
};

const postSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    attachments: [
      {
        data: String, // Base64 encoded data
        fileName: String, // Name of the file
        type: { type: String } // Type of attachment (image or file)
      }
    ],
    company: String,
    session: {
      startYear: Number,
      endYear: Number,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetedStreams: [{ type: String }], // Array of targeted streams
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  },
  { timestamps: { currentTime: () => getCurrentISTTime() } } // Correctly placed within the options object
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
