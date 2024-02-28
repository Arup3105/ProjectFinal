const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Register a new user
const registerUser = async (req, res) => {
  try {
    // Extract user details from the request body
    const { name, rollNumber, password, email, mobileNumber, address, photo, tenthMarks, twelfthMarks, cgpa, cv, stream } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ rollNumber });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const newUser = new User({
      name,
      rollNumber,
      password: hashedPassword,
      email,
      mobileNumber,
      address,
      photo,
      tenthMarks,
      twelfthMarks,
      cgpa,
      cv,
      stream,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    // Fetch user credentials from the database based on the roll number
    const user = await User.findOne({ rollNumber });

    if (user) {
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Generate a JWT token for user authentication
        const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'), { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
