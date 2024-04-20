const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticate');
const Post = require('../models/Post');
const User = require('../models/User');
const Company = require('../models/Company')
const Admin = require('../models/Admin')


// // Create a new post
// router.post('/create', authMiddleware, async (req, res) => {
//   try {
//     const { title, content, imageUrl } = req.body;

//     const newPost = new Post({
//       title,
//       content,
//       imageUrl,
//     });
//     await newPost.save();

//     res.status(201).json({ message: 'Post created successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// Get all posts
router.get('/seePosts', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('stream');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ targetedStreams: user.stream }).sort({ createdAt: -1 });

    console.log(posts)

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/shortByYear', authMiddleware, async (req, res) => {
  try {
    const allCompanies = await Company.find();

    const uniqueYearsSet = new Set();
    const uniqueYears = allCompanies.flatMap(company =>
      company.sessions.map(session => {
        const yearPair = { startYear: session.startYear, endYear: session.endYear };
        const key = JSON.stringify(yearPair);
        uniqueYearsSet.add(key);
        return yearPair;
      })
    );

    const uniqueYearsArray = Array.from(uniqueYearsSet).map(JSON.parse);

    res.json(uniqueYearsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/seeCompany/:startYear/:endYear', authMiddleware, async (req, res) => {
  try {
    const { startYear, endYear } = req.params;
    const userStream = req.user.stream;
    const isAdminRequest = !req.user.stream;

    const matchingCompanies = await Company.find({
      sessions: { $elemMatch: { startYear: parseInt(startYear), endYear: parseInt(endYear) } },
      ...(isAdminRequest ? {} : { targetedStreams: userStream })
    });

    const companyDetails = matchingCompanies.map(company => ({
      _id: company._id,
      name: company.name,
      targetedStreams: company.targetedStreams,
      sessions: company.sessions.filter(session =>
        session.startYear === parseInt(startYear) && session.endYear === parseInt(endYear)
      ),
    }));

    res.json(companyDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/postsByCompany/:companyName/:startYear/:endYear/:targetedStreams', authMiddleware, async (req, res) => {
  try {
    const { companyName, startYear, endYear, targetedStreams } = req.params;

    const userStream = req.user.stream;

    const targetedStreamsArray = targetedStreams.split(',');

    const posts = await Post.find({
      company: companyName,
      'session.startYear': parseInt(startYear),
      'session.endYear': parseInt(endYear),
      targetedStreams: { $in: targetedStreamsArray }
    }).sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.json({ message: 'No posts found for the specified company and session' });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
