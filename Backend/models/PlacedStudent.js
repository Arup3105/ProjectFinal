const mongoose = require('mongoose');

const PlacedStudentSchema = new mongoose.Schema({
  username: { type: String, required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  salary: Number,
  companyName: String,
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  approvedBy: String,
});

const PlacedStudent = mongoose.model('PlacedStudent', PlacedStudentSchema);
module.exports = PlacedStudent;
