// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: String,
  password: String,
  secretCode: String, // Add this field for the secret code
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
