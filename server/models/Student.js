const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    codeforcesHandle: String,
    currentRating: Number,
    maxRating: Number,
    lastUpdated: Date,
    reminderCount: { type: Number, default: 0 },
    reminderDisabled: { type: Boolean, default: false }
});

module.exports = mongoose.model("Student", studentSchema);

