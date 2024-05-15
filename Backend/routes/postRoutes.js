const express = require("express");
const router = express.Router();
const excel = require("excel4node");
const authMiddleware = require("../middleware/authenticate");
const Post = require("../models/Post");
const User = require("../models/User");
const Company = require("../models/Company");
const Admin = require("../models/Admin");
const Notification = require("../models/Notification");
const FormResponse = require("../models/FormResponse");
const PlacedStudent = require("../models/PlacedStudent");
const path = require("path");

// Get all posts
// router.get('/seePosts', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('stream');

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const posts = await Post.find({ targetedStreams: user.stream }).sort({ createdAt: -1 });

//     console.log(posts)

//     res.status(200).json(posts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

router.get("/shortByYear", authMiddleware, async (req, res) => {
  try {
    const allCompanies = await Company.find();

    const uniqueYearsSet = new Set();
    const uniqueYears = allCompanies.flatMap((company) =>
      company.sessions.map((session) => {
        const yearPair = {
          startYear: session.startYear,
          endYear: session.endYear,
        };
        const key = JSON.stringify(yearPair);
        uniqueYearsSet.add(key);
        return yearPair;
      })
    );

    const uniqueYearsArray = Array.from(uniqueYearsSet).map(JSON.parse);

    res.json(uniqueYearsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get(
  "/seeCompany/:startYear/:endYear",
  authMiddleware,
  async (req, res) => {
    try {
      const { startYear, endYear } = req.params;
      const userStream = req.user.stream;
      const isAdminRequest = !req.user.stream;

      const matchingCompanies = await Company.find({
        sessions: {
          $elemMatch: {
            startYear: parseInt(startYear),
            endYear: parseInt(endYear),
          },
        },
        ...(isAdminRequest ? {} : { targetedStreams: userStream }),
      });

      const companyDetails = matchingCompanies.map((company) => ({
        _id: company._id,
        name: company.name,
        targetedStreams: company.targetedStreams,
        sessions: company.sessions.filter(
          (session) =>
            session.startYear === parseInt(startYear) &&
            session.endYear === parseInt(endYear)
        ),
      }));

      res.json(companyDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get(
  "/postsByCompany/:companyName/:startYear/:endYear/:targetedStreams",
  authMiddleware,
  async (req, res) => {
    try {
      const { companyName, startYear, endYear, targetedStreams } = req.params;
      const targetedStreamsArray = targetedStreams.split(",");

      const posts = await Post.find({
        company: companyName,
        "session.startYear": parseInt(startYear),
        "session.endYear": parseInt(endYear),
        targetedStreams: { $in: targetedStreamsArray },
      }).sort({ createdAt: -1 });

      if (posts.length === 0) {
        return res.json({
          message: "No posts found for the specified company and session",
        });
      }
      //console.log(req.user);
      if (req.user.userRole === "admin") {
        await Promise.all(posts.map(async (post) => {
          const formResponse = await FormResponse.find({
            postId: post._id,
          });
          if (formResponse.length === 0) {
            return;
          } else {
            const formDetails = await Post.findById(post._id);
            if (formDetails.formData) {
              const formdatafields = Object.keys(formDetails.formData);
              const userDetails = Object.keys(User.schema.paths);
              const excludedFields = ['_id', '__v', 'secretCode','password'];
              const existingFields= formdatafields.concat(userDetails).filter(field => !excludedFields.includes(field));
              post.existingFields = existingFields;
              return;
            }
          }
          //console.log("formResponse", formResponse);
        }));
      }
      if (req.user._id) {
        const userId = req.user._id;
        //console.log(userId);
        const postsWithResponse = await Promise.all(
          posts.map(async (post) => {
            const formResponse = await FormResponse.findOne({
              postId: post._id,
              userId: userId,
            });
            if (formResponse) {
              //console.log("formResponse ",formResponse);
              return {
                ...post._doc,
                formData: null,
                submittedStatus: true,
              };
            }
            //console.log("post",post)

            return {
              ...post._doc,
              existingFields: post.existingFields,
            };
          })
        );
        //console.log("postsWithResponse",postsWithResponse)
        //console.log("final postsWithResponse",postsWithResponse);
        res.status(200).json(postsWithResponse);
      } else {
        res.status(200).json(posts);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.put("/editpost/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // if (post.CreatedBy.adminId !== req.user._id) {
    //   return res
    //     .status(403)
    //     .json({ message: "Not authorized to edit this post" });
    // }

    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = Date.now();

    await post.save();

    res.json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/delete/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { company, session, targetedStreams } = post;
    const countMatchingPosts = await Post.countDocuments({
      _id: { $ne: postId },
      company,
      session,
      targetedStreams: { $all: targetedStreams },
    });

    if (countMatchingPosts > 0) {
      await Notification.deleteMany({ postId });
      await Post.findByIdAndDelete(postId);
      res.json({ message: "Post deleted successfully" });
    } else if (countMatchingPosts === 0) {
      await Notification.deleteMany({ postId });
      await Post.findByIdAndDelete(postId);
      await Company.deleteOne({ name: company });
      res.json({ message: "Post and associated company deleted successfully" });
    } else {
      await Notification.deleteMany({ postId });
      await Post.findByIdAndDelete(postId);
      res.json({ message: "Post deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

async function retrieveExcelContent(postId, checkedFields) {
  try {
    const selectFields = checkedFields.reduce((acc, field) => {
      acc[`data.${field}`] = 1; // Include the field in the projection
      return acc;
    }, {});
    selectFields.postId = 1; // Include the postId field in the projection
    const formResponses = await FormResponse.find({ postId }).select(selectFields);

    const selectedFieldsResponses = formResponses.map(response => {
      const selectedFieldsData = {};
      checkedFields.forEach(field => {
        selectedFieldsData[field] = response.data[field];
      });
      return {
        _id: response._id,
        postId: response.postId,
        data: selectedFieldsData
      };
    });

    //console.log(selectedFieldsResponses)
    return { formResponses: selectedFieldsResponses };
  } catch (error) {
    console.error(error);
    throw error;
  }
}



router.post("/downloadResponse/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    //console.log(postId)
    const {checkedFields} = req.body;
    //console.log(checkedFields);
    const { formResponses } = await retrieveExcelContent(postId,checkedFields);
    //console.log("formResponses",formResponses);
    if (formResponses.length === 0) {
      return res
        .status(204)
        .json({ message: "No response found for the given postId." });
    }

    const wb = new excel.Workbook();
    const ws = wb.addWorksheet("Sheet 1");

    const headers = Object.keys(formResponses[0].data);
    headers.forEach((header, index) => {
      ws.cell(1, index + 1).string(header);
    });
    formResponses.forEach((formResponse, rowIndex) => {
      const rowData = Object.values(formResponse.data);
      rowData.forEach((value, colIndex) => {
        ws.cell(rowIndex + 2, colIndex + 1).string(value.toString());
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${postId}.xlsx`);
    wb.write(`${postId}ExcelFile.xlsx`, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
