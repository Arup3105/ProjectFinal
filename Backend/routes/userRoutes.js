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
const path = require("path");
const uploadfile = require("../utility/upload");
const fs = require("fs");

const FormResponse = require("../models/FormResponse");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "UserAttachments");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

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
      tenthMarks,
      twelfthMarks,
      cgpa,
      stream,
      secretCode,
    } = req.body;

    const existingUserByEmail = await User.findOne({ email });
    const existingUserByMobile = await User.findOne({ mobileNumber });
    const existingUserByRollNumber = await User.findOne({ rollNumber });
    const existingUserByRegNumber = await User.findOne({ regNumber });

    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    if (existingUserByMobile) {
      return res
        .status(400)
        .json({ message: "Mobile number is already registered" });
    }

    if (existingUserByRollNumber) {
      return res
        .status(400)
        .json({ message: "Roll number is already registered" });
    }

    if (existingUserByRegNumber) {
      return res
        .status(400)
        .json({ message: "Registration number is already registered" });
    }

    const files = req.files;
    const photo = req.files.find((file) => file.fieldname === "photo")?.path;
    const tenthMarkSheet = req.files.find(
      (file) => file.fieldname === "tenthMarkSheet"
    )?.path;
    const twelfthMarkSheet = req.files.find(
      (file) => file.fieldname === "twelfthMarkSheet"
    )?.path;
    const firstSemMarkSheet = req.files.find(
      (file) => file.fieldname === "firstSemMarkSheet"
    )?.path;
    const secondSemMarkSheet = req.files.find(
      (file) => file.fieldname === "secondSemMarkSheet"
    )?.path;
    const thirdSemMarkSheet = req.files.find(
      (file) => file.fieldname === "thirdSemMarkSheet"
    )?.path;
    const forthSemMarkSheet = req.files.find(
      (file) => file.fieldname === "forthSemMarkSheet"
    )?.path;
    const fifthSemMarkSheet = req.files.find(
      (file) => file.fieldname === "fifthSemMarkSheet"
    )?.path;
    const sixthSemMarkSheet = req.files.find(
      (file) => file.fieldname === "sixthSemMarkSheet"
    )?.path;
    const cv = req.files.find((file) => file.fieldname === "cv")?.path;

    console.log("Photo Path:", photo);
    const photoUrl = await uploadfile(photo);
    console.log("Tenth Mark Sheet Path:", tenthMarkSheet);
    const tenthMarkSheetUrl = await uploadfile(tenthMarkSheet);
    console.log("Twelfth Mark Sheet Path:", twelfthMarkSheet);
    const twelfthMarkSheetUrl = await uploadfile(twelfthMarkSheet);
    console.log("First Sem Mark Sheet Path:", firstSemMarkSheet);
    const firstSemMarkSheetUrl = await uploadfile(firstSemMarkSheet);
    console.log("Second Sem Mark Sheet Path:", secondSemMarkSheet);
    const secondSemMarkSheetUrl = await uploadfile(secondSemMarkSheet);
    console.log("Third Sem Mark Sheet Path:", thirdSemMarkSheet);
    const thirdSemMarkSheetUrl = await uploadfile(thirdSemMarkSheet);

    console.log("Forth Sem Mark Sheet Path:", forthSemMarkSheet);
    const forthSemMarkSheetUrl = await uploadfile(forthSemMarkSheet);

    console.log("Fifth Sem Mark Sheet Path:", fifthSemMarkSheet);
    const fifthSemMarkSheetUrl = await uploadfile(fifthSemMarkSheet);

    console.log("Sixth Sem Mark Sheet Path:", sixthSemMarkSheet);
    const sixthSemMarkSheetUrl = await uploadfile(sixthSemMarkSheet);

    console.log("CV Path:", cv);
    const cvUrl = await uploadfile(cv);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: name,
      rollNumber,
      regNumber,
      password: hashedPassword,
      email,
      mobileNumber,
      address,
      photo: photoUrl.url,
      tenthMarks,
      tenthMarkSheet: tenthMarkSheetUrl.url,
      twelfthMarks,
      twelfthMarkSheet: twelfthMarkSheetUrl.url,
      cgpa,
      firstSemMarkSheet: firstSemMarkSheetUrl.url,
      secondSemMarkSheet: secondSemMarkSheetUrl.url,
      thirdSemMarkSheet: thirdSemMarkSheetUrl?thirdSemMarkSheetUrl.url : null,
      forthSemMarkSheet: forthSemMarkSheetUrl ? forthSemMarkSheetUrl.url : null,
      fifthSemMarkSheet: fifthSemMarkSheetUrl ? fifthSemMarkSheetUrl.url : null,
      sixthSemMarkSheet: sixthSemMarkSheetUrl ? sixthSemMarkSheetUrl.url : null,
      cv: cvUrl.url,
      stream,
      secretCode,
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
    const { rollNumber, regNumber, secretCode, newPassword } =
      req.body;

    const user = await User.findOne({
      rollNumber,
      regNumber,
      secretCode,
    });

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

router.get("/notificationCount", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationsCount = await Notification.countDocuments({
      userId,
      read: false,
    });
    const notifications = await Notification.find({ userId }).select(
      "content read"
    );

    res
      .status(200)
      .json({ count: notificationsCount, notification: notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// notification
router.get("/read", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );

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
        "-_id -password -notifications -__v -secretCode"
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
router.put("/updateProfile", authMiddleware, upload.any(), async (req, res) => {
  try {
    const userId = req.user._id;
    const UserModel = req.user.userRole === "user" ? User : Admin;

    const updatedData = { ...req.body };
    const updateImage= {...req.files};
    //console.log(updateImage)
    for (const key in updateImage) {
      const file = updateImage[key];
      //console.log(file.fieldname, file.path);
      const fileUrl= await uploadfile(file.path)
      updatedData[file.fieldname] = fileUrl.url;
    }
    
    const updatedProfile = await UserModel.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/submitResponseForm",authMiddleware, async (req, res)=>{
  try {
    const {formDataToSend}=req.body;
    //console.log("submitResponseForm");
    const { id,...rest } = formDataToSend;
    const userId= req.user._id;
    //console.log(id,userId)
    const form = await FormResponse.findOne({ postId: id, userId: userId });
    //console.log(form)
    const userDetails = await User.findById(userId);

    const {username,rollNumber,regNumber,email,mobileNumber,cgpa,tenthMarks,twelfthMarks,cv} = userDetails;

    const data= {
      username,
        email,
        mobileNumber,
        cgpa,
        tenthMarks,
        twelfthMarks,
        ...rest,
        cv,
        rollNumber,
        regNumber,
    };
    //console.log(data);
    if (form) {
        return res.status(404).json({ message: "Form Already Submitted" });
    }else{
      const newForm = new FormResponse({
        postId: id,
        userId,
        submittedAt: Date.now(),
        data,
      });
      //console.log(newForm);

      await newForm.save();
      return res.status(201).json({ message: "Form created successfully" });
    }
} catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
});
module.exports = router;
