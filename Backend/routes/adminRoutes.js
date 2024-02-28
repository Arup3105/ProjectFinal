// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const config = require('config');

// Secret code for admin creation
const SECRET_CODE = config.get('adminSecretCode'); // Replace with your actual secret code

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch admin credentials from the database based on the username
    const admin = await Admin.findOne({ username });

    if (admin) {
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (passwordMatch) {
        // Redirect to admin dashboard if credentials match
        res.status(200).json({ message: 'Admin login successful', redirect: '/admin/dashboard' });
      } else {
        // Redirect to user dashboard if credentials don't match
        res.status(401).json({ message: 'Invalid credentials', redirect: '/user/dashboard' });
      }
    } else {
      // Redirect to user dashboard if admin not found
      res.status(401).json({ message: 'Admin not found', redirect: '/user/dashboard' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create a new admin (for initial setup) - Requires secret code
router.post('/create', async (req, res) => {
  try {
    const { username, password, secretCode } = req.body;

    // Verify the secret code before allowing admin creation
    if (secretCode !== SECRET_CODE) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Check if an admin with the given username already exists
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin with hashed password
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });

    // Save the new admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
