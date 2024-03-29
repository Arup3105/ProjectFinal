const mongoose = require('mongoose');

// get the current IST time
const getCurrentISTTime = () => {
  const istOffset = 330; // Indian Standard Time
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
        data: String, 
        fileName: String, 
        type: { type: String } 
      }
    ],
    company: String,
    session: {
      startYear: Number,
      endYear: Number,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetedStreams: [{ type: String }],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  },
  { timestamps: { currentTime: () => getCurrentISTTime() } } 
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
