
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  employeeId: { type: String, unique: true, required: true },
  email:{ type: String, unique: true, required: true },
  mobileNumber:{ type: String, unique: true, required: true },
  password: String,
  secretCode: String, 
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
