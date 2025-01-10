const express = require("express");
const CodeSnippet = require("../models/CodeSnippet");
const auth = require("../middleware/auth");
const router = express.Router();
const userModel = require("../models/User")
const projectModel = require("../models/CodeSnippet")
//var jwt = require("jsonwebtoken");


function getStartupCode(language) {
  if (language.toLowerCase() === "python") {
    return 'print("Hello World")';
  } else if (language.toLowerCase() === "java") {
    return 'public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }';
  } else if (language.toLowerCase() === "javascript") {
    return 'console.log("Hello World");';
  } else if (language.toLowerCase() === "cpp") {
    return '#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}';
  } else if (language.toLowerCase() === "c") {
    return '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}';
  } else if (language.toLowerCase() === "go") {
    return 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}';
  } else if (language.toLowerCase() === "bash") {
    return 'echo "Hello World"';
  } else {
    return "Language not supported";
  }
}
//Creating a new code snippet.
//(POST method is used for creation of snippets)
router.post("/createProject", auth, async (req, res) => {
  try {
    const { title, language } = req.body;
    const userId = req.user.userId; 
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }
    let project = await CodeSnippet.create({
      title,
      language: language, // Corrected to match the collection property
      userId: user._id, // Corrected to match schema field
      code: getStartupCode(language),
    });

    return res.status(200).json({
      success: true,
      msg: "Project created successfully",
      projectId: project._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//Reading all the snippets for the logged-in user. 
//(We use GET method for reading anything/getting a response from the server)
router.post("/getProjects", auth, async (req, res) => {
  try {
    // const userId = req.user.userId; 
    // let user = await userModel.findById(userId);
    const snippets = await CodeSnippet.find({ userId: req.user.userId });
    return res.status(200).json({
      success: true,
      msg: "Projects fetched successfully",
      projects: snippets,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Updating a snippet by id. 
//( We can use PUT/PATCH method for updating a particular snippet. )
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, code, projectLanguage } = req.body;

    const snippet = await CodeSnippet.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { title, code, projectLanguage },
      { new: true } // Return the updated document
    );

    if (!snippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }

    res.status(200).json(snippet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Deleting a snippet by id.
// (We use DELETE method to delete a snippet,
// in which we use 'findOneAndDelete' to atomically find a document and delete the snippet)
router.post("/deleteProject", auth, async (req, res) => {
  try {
    const {projectId} = req.body
    const snippet = await CodeSnippet.findOneAndDelete({
      _id: projectId,
      userId: req.user.userId,
    });
    if (!snippet) {
      return res.status(404).json({ success: false, msg: "Snippet not found" });
    }
    res
      .status(200)
      .json({ success: true, msg: "Snippet deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});
// router.post("/editProject", auth, async (req, res) => {
//   try {
//     const { projectId, newTitle } = req.body;

//     // Ensure both projectId and newTitle are present
//     if (!projectId || !newTitle || newTitle.trim() === "") {
//       return res
//         .status(400)
//         .json({ success: false, msg: "Project ID and title are required" });
//     }

//     // Find and update the project
//     const snippet = await CodeSnippet.findOneAndUpdate(
//       { _id: projectId, userId: req.user.userId },
//       { title: newTitle },
//       { new: true } // Ensure the updated document is returned
//     );

//     if (!snippet) {
//       return res
//         .status(404)
//         .json({ success: false, msg: "Project not found or unauthorized" });
//     }

//     res.status(200).json({
//       success: true,
//       msg: "Project title updated successfully",
//       project: snippet,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, msg: "Server error: " + error.message });
//   }
// });
router.post("/editProject", auth, async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debug log
    const { projectId, title } = req.body;
    console.log("projectId:", projectId, "title:", title); // Debug log

    const project = await projectModel.findOne({ _id: projectId });
    if (project) {
      project.title = title;
      await project.save();
      return res.status(200).json({
        success: true,
        msg: "Project edited successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "Project not found",
      });
    }
  } catch (error) {
    console.error("Error:", error); // Log the full error
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
});



module.exports = router;
