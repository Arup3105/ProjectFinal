const Admin = require('../models/Admin');

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    // Fetch all admins from the database
    const admins = await Admin.find();

    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Search admins by username
const searchAdminsByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    // Fetch admins from the database based on the provided username
    const admins = await Admin.find({ username: new RegExp(username, 'i') });

    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllAdmins,
  searchAdminsByUsername,
};

