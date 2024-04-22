const mongoose = require('mongoose');

const formSchema = new mongoose.Schema(
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
      submittedAt: { type: Date, default: Date.now },
      data: { type: Object }
    },
    { timestamps: false }
  );
  
  formSchema.pre('save', function (next) {
    if (!this.submittedAt) {
      this.submittedAt = new Date();
    }
    next();
  });
  
  const Form = mongoose.model('Form', formSchema);
  
  module.exports = Form;
  