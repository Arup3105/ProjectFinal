const mongoose = require('mongoose');
const { z } = require('zod');

// Zod validation schema for rollNumber
const RollNumberSchema = z
  .string()
  .refine((value) => value.startsWith('323') && value.length === 11, {
    message: 'Roll number must start with 323 and have 11 digits',
  });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: Number, unique: true, validate: RollNumberSchema.validator() },
  password: { type: String, required: true },
  regNumber: { type: Number, unique: true },
  email: { type: String, unique: true, required: true },
  mobileNumber: String,
  address: String,
  photo: String,
  tenthMarks: Number,
  tenthMarkSheet: String,
  twelfthMarks: Number,
  twelfthMarkSheet: String,
  cgpa: Number,
  firstSemMarkSheet: { type: String, required: true },
  secondSemMarkSheet: { type: String, required: true },
  thirdSemMarkSheet: { type: String, required: true },
  cv: { type: String, required: true },
  stream: { type: String, required: true }, // Add a new field for the stream
});

const User = mongoose.model('User', userSchema);
module.exports = User;
