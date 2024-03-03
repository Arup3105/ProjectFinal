// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification= require("../models/Notification");
const Review = require('../models/Review');
const Company = require('../models/Company');
const config = require('config');

const authenticateAdmin = require('../middleware/authenticateAdmin');

// Secret code for admin creation
const AUTH_CODE = config.get('adminCreatAuthCode'); // Replace with your actual secret code

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { employeeId, password} = req.body;

    // Fetch admin credentials from the database based on the username
    const admin = await Admin.findOne({ employeeId });

    if (admin) {
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (passwordMatch) {
        // Redirect to admin dashboard if both credentials match
        const token = jwt.sign({ adminId: admin._id }, config.get('jwtSecret'), { expiresIn: '1h' });
        res.status(200).json({ message: 'Admin login successful', token , redirect: '/admin/dashboard' });
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
    const { username, employeeId, password,email,mobileNumber, secretCode, authCode } = req.body;

    // Verify the secret code before allowing admin creation
    if (authCode !== AUTH_CODE) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Check if an admin with the given username already exists
    const existingAdmin = await Admin.findOne({ username , employeeId });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin with hashed password
    const newAdmin = new Admin({
      username,
      employeeId,
      email,
      mobileNumber,
      password: hashedPassword,
      secretCode,
    });

    // Save the new admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/forgetPassword', async (req, res) => {
  try {
    const { username,employeeId, secretCode, newPassword } = req.body;

    // Check if the admin with the provided details exists
    const admin = await Admin.findOne({ username,employeeId, secretCode });

    if (admin) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the admin's password
      admin.password = hashedPassword;
      await admin.save();
      
      res.status(200).json({ message: 'Password reset initiated successfully' });
    } else {
      res.status(404).json({ message: 'Admin not found with provided details' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/searchUser', authenticateAdmin, async (req, res) => {
  try {
    const { searchQuery } = req.body;

    // Create a regex pattern for partial matching
    const partialMatchPattern = new RegExp(searchQuery, 'i');

    // Convert the searchQuery to a number if it is a valid number
    const rollNumberQuery = !isNaN(searchQuery) ? parseInt(searchQuery) : null;

    // Define the search criteria for name, roll number, and stream
    const searchCriteria = {
      $or: [
        { name: { $regex: partialMatchPattern } },
        { rollNumber: { $regex: new RegExp(searchQuery, 'i') } },
        { stream: { $regex: partialMatchPattern } },
      ],
    };

    // Perform the search in the User collection
    const users = await User.find(searchCriteria).select('name rollNumber stream ');

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/seeAllUser', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select('name rollNumber stream');

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Assuming you have a getCurrentISTDate function to get the current IST date
const getCurrentISTDate = () => {
  const istOffset = 330; // Offset in minutes for Indian Standard Time
  const now = new Date();
  const istDate = new Date(now.getTime() + istOffset * 60000);
  return istDate;
};

router.post('/createPost', authenticateAdmin, async (req, res) => {
  try {
    const { title, content, imageUrl, company, targetedStreams } = req.body;

    const streamsArray = targetedStreams.split(',').map(stream => stream.trim());

    const currentDate = getCurrentISTDate();
    const currentYear = currentDate.getFullYear();
    let sessionStartYear, sessionEndYear;

    if (currentDate.getMonth() < 6) {
      sessionStartYear = currentYear - 1;
      sessionEndYear = currentYear;
    } else {
      sessionStartYear = currentYear;
      sessionEndYear = currentYear + 1;
    }

    const capitalizedCompany = company.toUpperCase();

    const existingCompany = await Company.findOne({
      name: capitalizedCompany,
      targetedStreams: streamsArray,
      sessions: { $elemMatch: { startYear: sessionStartYear, endYear: sessionEndYear } }
    });

    if (!existingCompany) {
      const newCompany = new Company({
        name: capitalizedCompany,
        sessions: [{ startYear: sessionStartYear, endYear: sessionEndYear }],
        targetedStreams: streamsArray,
      });
      await newCompany.save();
    }

    const newPost = new Post({
      title,
      content,
      imageUrl,
      company: capitalizedCompany,
      session: {
        startYear: sessionStartYear,
        endYear: sessionEndYear,
      },
      targetedStreams: streamsArray,
    });

    await newPost.save();

    const usersInStreams = await User.find({ stream: { $in: streamsArray } });

    const notifications = usersInStreams.map(user => ({
      userId: user._id,
      postId: newPost._id,
      content: `New post: ${title}`,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




router.put('/updatePost/:postId', async (req, res) => {
  const postId = req.params.postId;
  const { title, content, imageUrl, company, targetedStreams } = req.body;

  try {
    // Find the post by ID
    const post = await Post.findByIdAndUpdate(
      postId,
      { title, content, imageUrl, company, targetedStreams },
      { new: true } // This ensures you get the updated document in the response
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Approve a review
router.put('/approveReview/:reviewId', authenticateAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the review by ID
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Approve the review
    review.approved = true;
    review.updatedAt = Date.now();

    // Save the updated review to the database
    await review.save();

    res.status(200).json({ message: 'Review approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a user profile with verification in the request body
router.delete('/deleteUser/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { confirmation } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the deletion by checking the confirmation in the request body
    if (confirmation !== 'confirm') {
      return res.status(400).json({ message: 'Deletion not confirmed' });
    }

    // Delete the user from the database
    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Check if any admin exists
router.get('/checkAllAdmin', authenticateAdmin, async (req, res) => {
  try {
    // Find all admin users in the database
    const allAdmins = await Admin.find({}, 'username mobileNumber email');

    res.status(200).json({ admins: allAdmins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/addComment', authenticateAdmin, async (req, res) => {
  try {
    const { postId, content } = req.body;

    // Find the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add the comment to the post's comments array
    post.comments.push({
      userId: req.admin._id, // Assuming admin is authenticated using the middleware
      content,
    });

    // Save the updated post
    await post.save();

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to delete a comment
router.delete('/deleteComment/:commentId', authenticateAdmin, async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check if the comment exists
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the admin is authorized to delete the comment (you may customize this based on your requirements)
    // For example, you might want to check if the admin created the comment or has certain permissions

    // Perform the deletion
    await comment.remove();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
