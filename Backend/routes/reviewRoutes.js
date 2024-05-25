const express = require('express');
const router = express.Router();
const PlacedStudent = require('../models/PlacedStudent');
const authMiddleware = require("../middleware/authenticate");
const User = require("../models/User");

// Route to handle placement submissions
router.post('/placed',authMiddleware, async (req, res) => {
  try {
    const {package, companyName,year } = req.body;
    //console.log(req.body)
    const userId= req.user._id
    //console.log("userid",userId)

    const user = await User.findById(userId);
    const placedStudent = new PlacedStudent({
      username: user.username,
      userId:userId,
      stream: user.stream,
      year,
      salary:package,
      companyName,
      rollNumber:user.rollNumber,
      approvedBy:null
    });
    //console.log(placedStudent);
    await placedStudent.save();
    
    res.status(201).json({ message: 'Placement submitted successfully.'});
  } catch (error) {
    console.error('Error submitting placement:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to fetch previous placement submissions
router.get('/prev-submission',authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    //console.log("userid",userId)
    const previousSubmits = await PlacedStudent.find({ userId: userId });
    //console.log(previousSubmits)
    res.status(200).json(previousSubmits);
  } catch (error) {
    console.error('Error fetching previous submissions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post("/approverdReq",authMiddleware,async(req, res)=>{
  const {postId}= req.body;
  const approvedBy = req.user.username;
  try {
    //console.log("postId",postId,"approvedBy",approvedBy)
    const updatedDocument = await PlacedStudent.findOneAndUpdate(
      { _id: postId },
      { $set: { approved: true, approvedBy: approvedBy } },
      { new: true }
    );
    //console.log(updatedDocument)
      if (updatedDocument) {
        res.status(200).json({ message: "Document updated successfully", updatedDocument });
      } else {
        res.status(404).json({ message: "Document not found" });
      }
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
    );

router.get('/placedStudentData',authMiddleware, async (req, res) => {
      try {
        const placedData = await PlacedStudent.find();
        res.status(200).json(placedData);
      } catch (error) {
        console.error('Error fetching placed data:', error);
        res.status(500).json({ message: 'Error fetching placed data' });
      }
    });

module.exports = router;
