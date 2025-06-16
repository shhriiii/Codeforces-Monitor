const cron = require('node-cron');
const axios = require('axios');
const Student = require('../models/Student');

const syncCodeforcesData = async () => {
  console.log("🔄 Running daily Codeforces sync...");

  const students = await Student.find({});
  for (const student of students) {
    const handle = student.codeforcesHandle;
    try {
      const res = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
      const history = res.data.result;

      if (history.length > 0) {
        const current = history[history.length - 1].newRating;
        const max = Math.max(...history.map(e => e.newRating));

        student.currentRating = current;
        student.maxRating = max;
        student.lastUpdated = new Date();
        await student.save();

        console.log(`✅ Updated: ${student.name} (${handle})`);
      }
    } catch (err) {
      console.error(`❌ Failed to fetch rating for ${handle}:`, err.message);
    }
  }

  console.log("✅ All student ratings synced.");
};
// Run once right now for testing
// syncCodeforcesData();

// Schedule: every day at 2:00 AM
cron.schedule("0 2 * * *", syncCodeforcesData); // new: 6:03 PM daily





