// controllers/studentController.js
const axios = require('axios');
const Student = require('../models/Student');

const getRatingFromCF = async (handle) => {
  try {
    const res = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
    const history = res.data.result;
    if (history.length === 0) return { current: null, max: null };

    const currentRating = history[history.length - 1].newRating;
    const maxRating = Math.max(...history.map(entry => entry.newRating));
    return { current: currentRating, max: maxRating };
  } catch (err) {
    console.error("Error fetching rating from Codeforces:", err.message);
    return { current: null, max: null };
  }
};

exports.addStudent = async (req, res) => {
  try {
    const { name, email, phone, codeforcesHandle } = req.body;

    const { current, max } = await getRatingFromCF(codeforcesHandle);

    const newStudent = new Student({
      name,
      email,
      phone,
      codeforcesHandle,
      currentRating: current,
      maxRating: max,
      lastUpdated: new Date()
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add student' });
  }
};


exports.updateStudent = async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) return res.status(404).json({ error: 'Student not found' });
  
      const prevHandle = student.codeforcesHandle;
      const newHandle = req.body.codeforcesHandle;
  
      // Check if handle changed
      if (prevHandle !== newHandle && newHandle) {
        const { currentRating, maxRating } = await getRatingFromCF(newHandle);
        student.currentRating = currentRating;
        student.maxRating = maxRating;
        student.lastUpdated = new Date();
      }
  
      // Update rest fields
      Object.assign(student, req.body);
      const updated = await student.save();
      res.json(updated);
    } catch (err) {
      console.error("Error updating student:", err.message);
      res.status(500).json({ error: 'Update failed' });
    }
  };
  