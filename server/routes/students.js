const express = require("express");
const router = express.Router();
const Student = require("../models/Student.js");
const { addStudent } = require('../controllers/studentController');

// Get all students
router.get("/", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// Get student by ID and redirect to their CF profile
// router.get('/:id', async (req, res) => {
//     try {
//       const student = await Student.findById(req.params.id);
//       if (!student || !student.codeforcesHandle) {
//         return res.status(404).json({ message: 'Student not found or no CF handle' });
//       }
//       res.redirect(`https://codeforces.com/profile/${student.codeforcesHandle}`);
//     } catch (err) {
//       console.error("Error fetching student by ID:", err);
//       res.status(500).json({ message: 'Server error' });
//     }
// });
// ✅ Corrected: Return the student data for frontend
router.get('/:id', async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(student); // Send JSON instead of redirect
    } catch (err) {
      console.error("Error fetching student by ID:", err);
      res.status(500).json({ message: 'Server error' });
    }
});


// Add student with rating fetch
router.post('/', addStudent);

// Edit student
router.put("/:id", async (req, res) => {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
});

// Delete student
router.delete("/:id", async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;

