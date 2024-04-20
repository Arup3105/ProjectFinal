const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const authMiddleware = require("../middleware/authenticate");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const multer = require("multer");
const JWT_SECRET_KEY = config.get("jwtSecret");
const upload = multer({
  limits: {
    fieldSize: 1024 * 1024 * 20,
  },
});

// User registration Code
router.post("/register", upload.any(), async (req, res) => {
  try {
    const {
      name,
      rollNumber,
      regNumber,
      password,
      email,
      mobileNumber,
      address,
      photo,
      tenthMarks,
      tenthMarkSheet,
      twelfthMarks,
      twelfthMarkSheet,
      cgpa,
      firstSemMarkSheet,
      secondSemMarkSheet,
      thirdSemMarkSheet,
      forthSemMarkSheet,
      fifthSemMarkSheet,
      sixthSemMarkSheet,
      cv,
      stream,
    } = req.body;

    const existingUserByEmail = await User.findOne({ email });
    const existingUserByMobile = await User.findOne({ mobileNumber });
    const existingUserByRollNumber = await User.findOne({ rollNumber });
    const existingUserByRegNumber = await User.findOne({ regNumber });

    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    if (existingUserByMobile) {
      return res.status(400).json({ message: "Mobile number is already registered" });
    }

    if (existingUserByRollNumber) {
      return res.status(400).json({ message: "Roll number is already registered" });
    }

    if (existingUserByRegNumber) {
      return res.status(400).json({ message: "Registration number is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: name,
      rollNumber,
      regNumber,
      password: hashedPassword,
      email,
      mobileNumber,
      address,
      photo,
      tenthMarks,
      tenthMarkSheet,
      twelfthMarks,
      twelfthMarkSheet,
      cgpa,
      firstSemMarkSheet,
      secondSemMarkSheet,
      thirdSemMarkSheet,
      forthSemMarkSheet,
      fifthSemMarkSheet,
      sixthSemMarkSheet,
      cv,
      stream,
      notifications: [],
    });
    await newUser.save();

    const token = jwt.sign(
      {
        userId: newUser._id,
        username: newUser.name,
        rollNumber: newUser.rollNumber,
      },
      config.get("jwtSecret"),
      { expiresIn: "1d" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { rollNumber, password } = req.body;
    const user = await User.findOne({ rollNumber });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign(
          {
            userId: user._id,
            username: user.name,
            rollNumber: user.rollNumber,
          },
          config.get("jwtSecret"),
          { expiresIn: "1d" }
        );

        res.status(200).json({ message: "User login successful", token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Forget Password
router.post("/forgetPassword", async (req, res) => {
  try {
    const { rollNumber, regNumber, mobileNumber, email, newPassword } = req.body;

    const user = await User.findOne({ rollNumber, regNumber, mobileNumber, email });

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res
        .status(200)
        .json({ message: "Password reset initiated successfully" });
    } else {
      res.status(404).json({ message: "User not found with provided details" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/notificationCount",authMiddleware, async(req,res)=>{
  try {
    const userId = req.user._id;
    const notificationsCount = await Notification.countDocuments({ userId, read: false });
    const notifications = await Notification.find({ userId}).select("content read");

    res.status(200).json({count: notificationsCount, notification: notifications});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// notification 
router.get("/read", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Notification.updateMany({ userId, read: false }, { $set: { read: true } });

    res.status(200).json("Done");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// User profile and admin Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    let profile;
    if (req.user.userRole === "user") {
      profile = await User.findById(req.user._id).select(
        "-_id -password -notifications -__v"
      );
    } else {
      profile = await Admin.findById(req.user._id).select(
        "-_id -password -__v"
      );
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update profile 
router.put("/updateProfile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedData = req.body;
    const UserModel = req.user.userRole === "user" ? User : Admin;

    const updatedProfile = await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Comment in a post 
router.post("/addComment/:postId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;
    const { content } = req.body;

    const newComment = new Comment({ userId, postId, content });

    await newComment.save();

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add  review to a post 
router.post("/addReview/:postId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;
    const { content } = req.body;

    const newReview = new Review({ userId, postId, content });

    await newReview.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

  // to check notification
router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const userNotifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(userNotifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
