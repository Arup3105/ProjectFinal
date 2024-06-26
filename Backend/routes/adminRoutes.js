// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification= require("../models/Notification");
const Company = require('../models/Company');
const config = require('config');
const multer = require('multer');
const path = require('path');
const uploadOnCloudinary = require('../utility/cloudinary');
const fs =require('fs');

const authenticateAdmin = require('../middleware/authenticate');

const AUTH_CODE = config.get('adminCreatAuthCode'); 
const MAX_RETRY_ATTEMPTS = 3;



router.post('/login', async (req, res) => {
  try {
    const { employeeId, password} = req.body;
    const admin = await Admin.findOne({ employeeId });

    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (passwordMatch ) {
        const isAdmin = true;
        const token = jwt.sign({ adminId: admin._id }, config.get('jwtSecret'), { expiresIn: '1d' });
        res.status(200).json({ message: 'Admin login successful', token ,isAdmin, redirect: '/admin/dashboard' });
      } else {
        res.status(401).json({ message: 'Invalid credentials', redirect: '/user/dashboard' });
      }
    } else {
      res.status(401).json({ message: 'Admin not found', redirect: '/user/dashboard' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/create', async (req, res) => {
  try {
    const { username, employeeId, password,email,mobileNumber, secretCode, authCode } = req.body;

    if (authCode !== AUTH_CODE) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const existingAdmin = await Admin.findOne({ employeeId });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const newAdmin = new Admin({
      username,
      employeeId,
      email,
      mobileNumber,
      password: hashedPassword,
      secretCode,
    });


    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/forgetPassword', async (req, res) => {
  try {
    const { employeeId, secretCode, newPassword } = req.body;
    const admin = await Admin.findOne({ employeeId, secretCode });
    
    if (admin) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
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
    const partialMatchPattern = new RegExp(searchQuery, 'i');

    const rollNumberQuery = !isNaN(searchQuery) ? parseInt(searchQuery) : null;

    const searchCriteria = {
      $or: [
        { username: { $regex: partialMatchPattern } },
        { rollNumber: { $regex: new RegExp(searchQuery, 'i') } },
        { stream: { $regex: partialMatchPattern } },
        { mobileNumber: { $regex: new RegExp(searchQuery, 'i') } }, 
        { email: { $regex: new RegExp(searchQuery, 'i') } },
      ],
    };

    const users = await User.find(searchCriteria).select('username rollNumber stream ');

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// router.get('/user', async (req, res) => {
//   try {
//     const { rollNumber } = req.query;
//     const userData = await User.findOne({ rollNumber }).select('-_id -password -__v -notifications');
//     res.json(userData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

const getCurrentISTDate = () => {
  const istOffset = 330; 
  const now = new Date();
  const istDate = new Date(now.getTime() + istOffset * 60000);
  return istDate;
};

// Multer storage 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'postAttachments');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
          Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

router.post('/createPost', authenticateAdmin, upload.array("attachments",15), async (req, res) => {
  try {
  // console.log(req.body);
  //console.log(req.files);

    const { title, content, targetedStreams, formData , company } = req.body;
    const filenames =[];

    const targetedStreamsArray = targetedStreams.split(",");
    const formDataObject = JSON.parse(formData);
    //console.log(formDataObject);
    if(req.user.userRole === 'admin'){
    const attachments = req.files;
    for (let attachment of attachments) {
      let fname = await uploadOnCloudinary(attachment.path);
      let retryCount = 0;
      while (fname === null && retryCount < MAX_RETRY_ATTEMPTS) {
        console.log(`Retry attempt ${retryCount + 1}`);
        fname = await uploadOnCloudinary(attachment.path);
        retryCount++;
      }
      if (fname === null) {
          fs.unlinkSync(attachment.path);
      } else {
        filenames.push(fname.url);
        fs.unlinkSync(attachment.path)
      }
    }

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
      targetedStreams:targetedStreamsArray,
      sessions: { $elemMatch: { startYear: sessionStartYear, endYear: sessionEndYear } }
    });

    if (!existingCompany) {
      const newCompany = new Company({
        name: capitalizedCompany,
        sessions: [{ startYear: sessionStartYear, endYear: sessionEndYear }],
        targetedStreams:targetedStreamsArray,
      });
      await newCompany.save();
    }

    
    const newPost = new Post({
      title,
      content,
      attachments: filenames,
      company: capitalizedCompany,
      session: {
        startYear: sessionStartYear,
        endYear: sessionEndYear,
      },
      targetedStreams:targetedStreamsArray,
      CreatedBy: {
        adminId: req.user._id, 
        adminName: req.user.username
      },
      formData : formDataObject,
    });
    await newPost.save();

    const usersInStreams = await User.find({ stream: { $in: targetedStreams } }).select('_id');
    const notifications = usersInStreams.map(userId => ({
      userId,
      postId: newPost._id,
      content: `New post: ${title}`,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ message: 'Post created successfully' });
  }else{
    res.status(500).json({message: "Authentication error"});
  }
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




// router.put('/updatePost/:postId', async (req, res) => {
//   const postId = req.params.postId;
//   const { title, content, imageUrl, company, targetedStreams } = req.body;

//   try {
//     const post = await Post.findByIdAndUpdate(
//       postId,
//       { title, content, imageUrl, company, targetedStreams },
//       { new: true } 
//     );

//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     res.status(200).json({ message: 'Post updated successfully', post });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


// Approve a placed student
router.put('/approveReview/:reviewId', authenticateAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.approved = true;
    review.updatedAt = Date.now();

    await review.save();

    res.status(200).json({ message: 'Review approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/user/:rollNumber', authenticateAdmin, async (req, res) => {
  try {
    const rollNumber = req.params.rollNumber;
    
    const user = await User.findOne({ rollNumber },{ _id: 0, __v: 0, password: 0,secretCode: 0}).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a user profile 
// router.delete('/deleteUser/:userId', authenticateAdmin, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { confirmation } = req.body;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (confirmation !== 'confirm') {
//       return res.status(400).json({ message: 'Deletion not confirmed' });
//     }

//     await User.deleteOne({ _id: userId });

//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


// Check existing admins
// router.get('/checkAllAdmin', authenticateAdmin, async (req, res) => {
//   try {
//     const allAdmins = await Admin.find({}, 'username mobileNumber email');

//     res.status(200).json({ admins: allAdmins });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// router.post('/addComment', authenticateAdmin, async (req, res) => {
//   try {
//     const { postId, content } = req.body;

//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     post.comments.push({
//       userId: req.admin._id,
//       content,
//     });
//     await post.save();

//     res.status(201).json({ message: 'Comment added successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// Route to delete a comment
// router.delete('/deleteComment/:commentId', authenticateAdmin, async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const comment = await Comment.findById(commentId);

//     if (!comment) {
//       return res.status(404).json({ message: 'Comment not found' });
//     }
//     await comment.remove();

//     res.status(200).json({ message: 'Comment deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

module.exports = router;
