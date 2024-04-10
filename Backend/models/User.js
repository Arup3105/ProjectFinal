const mongoose = require('mongoose');
const { z } = require('zod');

const RollNumberSchema = z
  .string()
  .refine((value) => value.startsWith('323') && value.length === 11, {
    message: 'Enter Your University RollNumber',
  });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
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
  regNumber: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  mobileNumber: { type: String, unique: true, required: true },
  address: String,
  photo: String,
  tenthMarks: { type: Number, required: true ,
    validate: {
      validator: value => value > 0 && value < 100,
      message: props => `${props.value} is not a valid tenth mark. Tenth marks should be greater than 0 and less than 100.`
    }},
  tenthMarkSheet:  { type: String, required: true },
  twelfthMarks: { type: Number, required: true ,
    validate: {
      validator: value => value > 0 && value < 100,
      message: props => `${props.value} is not a valid twerlfth mark. Tenth marks should be greater than 0 and less than 100.`
    }},
  twelfthMarkSheet: { type: String, required: true },
  cgpa:{ type: Number, required: true,validate: {
    validator: value => value > 0 && value < 10,
    message: props => `${props.value} is not a valid CGPA. Tenth marks should be greater than 0 and less than 10.`
  } },
  firstSemMarkSheet: { type: String, required: true },
  secondSemMarkSheet: { type: String, required: true },
  thirdSemMarkSheet: { type: String, required: true },
  forthSemMarkSheet: {type : String , default: null},
  fifthSemMarkSheet: {type : String , default: null},
  sixthSemMarkSheet: {type : String , default: null},
  cv: { type: String, required: true },
  stream: { type: String, required: true }, 
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
