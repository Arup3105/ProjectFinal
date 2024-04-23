const mongoose = require('mongoose');

const formSchema = new mongoose.Schema(
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
      userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
  
  const FormResponse = mongoose.model('FormResponse', formSchema);
  
  module.exports = FormResponse;
  