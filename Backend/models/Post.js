const mongoose = require('mongoose');

const getCurrentISTTime = () => {
  const istOffset = 330;
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
    targetedStreams: [{ type: String }],
    CreatedBy: {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      adminName: String,
    },
  },
  { timestamps: { currentTime: () => getCurrentISTTime() } } 
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
