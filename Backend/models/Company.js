const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  startYear: Number,
  endYear: Number,
});

const companySchema = new mongoose.Schema({
  name: String,
  sessions: [sessionSchema],
  targetedStreams: [{ type: String }]
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
