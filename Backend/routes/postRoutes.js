// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticateUser');
const Post = require('../models/Post');
const User = require('../models/User');
const Company = require('../models/Company')


// Create a new post
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;

    // Create a new post
    const newPost = new Post({
      title,
      content,
      imageUrl,
      // Add other fields as needed
    });

    // Save the post to the database
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all posts
router.get('/seePosts', authMiddleware, async (req, res) => {
  try {
    // Fetch the authenticated user's stream
    const user = await User.findById(req.user._id).select('stream');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch posts that target the user's stream
    const posts = await Post.find({ targetedStreams: user.stream }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/shortByYear', authMiddleware, async (req, res) => {
  try {
    // Fetch all companies from the database
    const allCompanies = await Company.find();

    // Extract unique starting and ending years from the company sessions
    const uniqueYearsSet = new Set();
    const uniqueYears = allCompanies.flatMap(company =>
      company.sessions.map(session => {
        const yearPair = { startYear: session.startYear, endYear: session.endYear };
        const key = JSON.stringify(yearPair);
        uniqueYearsSet.add(key);
        return yearPair;
      })
    );

    // Convert the set back to an array
    const uniqueYearsArray = Array.from(uniqueYearsSet).map(JSON.parse);

    // Send the array of unique years as a JSON response
    res.json(uniqueYearsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/seeCompany/:startYear/:endYear', authMiddleware, async (req, res) => {
  try {
    const { startYear, endYear } = req.params;

    // Fetch the user's stream
    const userStream = req.user.stream;

    // Fetch companies that match the specified startYear and endYear
    const matchingCompanies = await Company.find({
      sessions: { $elemMatch: { startYear: parseInt(startYear), endYear: parseInt(endYear) } },
      targetedStreams: userStream
    });

    // Extract only the relevant details from each matching company
    const companyDetails = matchingCompanies.map(company => ({
      _id: company._id,
      name: company.name,
      sessions: company.sessions.filter(session =>
        session.startYear === parseInt(startYear) && session.endYear === parseInt(endYear)
      ),
      // Add other details as needed
    }));

    // Send the array of matching company details as a JSON response
    res.json(companyDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/postsByCompany/:companyName/:startYear/:endYear', authMiddleware, async (req, res) => {
  try {
    const { companyName, startYear, endYear } = req.params;

    const userStream = req.user.stream;

    // Fetch posts that match the specified company and session
    const posts = await Post.find({
      company: companyName,
      'session.startYear': parseInt(startYear),
      'session.endYear': parseInt(endYear),
      targetedStreams: userStream
    }).sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for the specified company and session' });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
