const mongoose = require('mongoose');

const PlacedStudentSchema = new mongoose.Schema({
  username: { type: String, required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  salary: String,
  stream: String,
  companyName: String,
  year : String,
  rollNumber: Number,
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  approvedBy: { type: String, default: null },
});

const PlacedStudent = mongoose.model('PlacedStudent', PlacedStudentSchema);
module.exports = PlacedStudent;
