const mongoose = require('mongoose');
const { z } = require('zod');

// Zod validation schema for rollNumber
const RollNumberSchema = z
  .string()
  .refine((value) => value.startsWith('323') && value.length === 11, {
    message: 'Enter Your University RollNumber',
  });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: {
    type: String,
    unique: true,
    validate: {
      validator: (value) => RollNumberSchema.safeParse(value).success,
      message: (props) => props.reason.message,
    },
    required: true,
  },
  password: { type: String, required: true },
  regNumber: { type: Number, unique: true },
  email: { type: String, unique: true, required: true },
  mobileNumber: { type: String, unique: true, required: true },
  address: String,
  photo: String,
  tenthMarks: { type: Number, required: true },
  tenthMarkSheet:  { type: String, required: true },
  twelfthMarks: { type: Number, required: true },
  twelfthMarkSheet: { type: String, required: true },
  cgpa: Number,
  firstSemMarkSheet: { type: String, required: true },
  secondSemMarkSheet: { type: String, required: true },
  thirdSemMarkSheet: { type: String, required: true },
  forthSemMarkSheet: {type : String , default: null},
  fifthSemMarkSheet: {type : String , default: null},
  sixthSemMarkSheet: {type : String , default: null},
  cv: { type: String, required: true },
  stream: { type: String, required: true }, // Add a new field for the stream
  notifications: [
    {
      message: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
