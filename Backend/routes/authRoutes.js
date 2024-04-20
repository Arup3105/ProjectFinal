const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('config');

//const JWT_SECRET_KEY = config.get('jwtSecret');

// // User registration
// router.post('/register', async (req, res) => {
//   try {
//     const { name, rollNumber, password } = req.body;

//     const existingUser = await User.findOne({ rollNumber });

//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists with this roll number' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       rollNumber,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // User login
// router.post('/login', async (req, res) => {
//   try {
//     const { rollNumber, password } = req.body;

//     const user = await User.findOne({ rollNumber });

//     if (user) {
//       const passwordMatch = await bcrypt.compare(password, user.password);

//       if (passwordMatch) {
//         const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });

//         res.status(200).json({ message: 'User login successful', token });
//       } else {
//         res.status(401).json({ message: 'Invalid credentials' });
//       }
//     } else {
//       res.status(401).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

module.exports = router;
