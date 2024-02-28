// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  content: String,
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
