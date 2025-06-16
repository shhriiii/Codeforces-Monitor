


const express = require('express');
const axios = require('axios');
const router = express.Router();

// Helper function to filter recent submissions
const filterSubmissionsByDays = (submissions, days) => {
    const cutoff = Date.now() / 1000 - days * 24 * 60 * 60;
    return submissions.filter(sub => sub.creationTimeSeconds >= cutoff);
};

// Route: Submission Heatmap Data
router.get("/heatmap/:handle", async (req, res) => {
    const days = parseInt(req.query.days || "365");
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    // Fetch accepted submissions
    const resp = await axios.get(`https://codeforces.com/api/user.status?handle=${req.params.handle}`);
    const subs = resp.data.result;

    const filtered = subs.filter(s =>
        s.verdict === "OK" &&
        s.creationTimeSeconds * 1000 >= cutoff
    );

    const counts = {};
    filtered.forEach(sub => {
        const day = new Date(sub.creationTimeSeconds * 1000)
            .setHours(0, 0, 0, 0);
        counts[day] = (counts[day] || 0) + 1;
    });

    res.json(counts);
});



// Route: Problem Solving Stats
router.get("/problems/:handle", async (req, res) => {
    const { handle } = req.params;
    const days = parseInt(req.query.days || 30);

    try {
        const resp = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        const allSubs = resp.data.result;

        const recentAccepted = filterSubmissionsByDays(
            allSubs.filter(s => s.verdict === "OK" && s.problem.rating),
            days
        );

        const ratingBuckets = {};
        let totalRating = 0;
        let hardest = null;

        recentAccepted.forEach(sub => {
            const rating = sub.problem.rating;
            totalRating += rating;

            if (!ratingBuckets[rating]) ratingBuckets[rating] = 0;
            ratingBuckets[rating]++;

            if (!hardest || rating > hardest.rating) {
        
        hardest = {
                    name: sub.problem.name,
                    rating,
                };
            }
        });

        res.json({
            totalSolved: recentAccepted.length,
            avgRating: recentAccepted.length ? Math.round(totalRating / recentAccepted.length) : 0,
            avgPerDay: +(recentAccepted.length / days).toFixed(2),
            hardestProblem: hardest || {},
            ratingBuckets,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch Codeforces problem data" });
    }
});

// Route: Contest Stats
// 
router.get("/contests/:handle", async (req, res) => {
  const { handle } = req.params;
  const days = parseInt(req.query.days || "90");

  try {
    const [ratingRes, submissionRes] = await Promise.all([
      axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`),
      axios.get(`https://codeforces.com/api/user.status?handle=${handle}`)
    ]);

    const allContests = ratingRes.data.result;
    const allSubs = submissionRes.data.result;

    const now = Date.now() / 1000;
    const fromTime = now - days * 24 * 60 * 60;

    const filteredContests = allContests
      .filter(c => c.ratingUpdateTimeSeconds >= fromTime)
      .map(c => {
        const contestId = c.contestId;

        // Submissions in this contest
        const subsInContest = allSubs.filter(
          s => s.problem && s.problem.contestId === contestId
        );

        const solved = new Set();
        const allProblems = new Set();

        subsInContest.forEach(sub => {
          const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
          allProblems.add(problemId);
          if (sub.verdict === "OK") {
            solved.add(problemId);
          }
        });

        const totalProblems = allProblems.size;
        const unsolvedCount = totalProblems - solved.size;

        const unsolvedProblems = Array.from(allProblems).filter(
          p => !solved.has(p)
        );

        // ✅ For debugging
        // console.log(`🎯 Contest: ${c.contestName} (${contestId})`);
        // console.log(`🧩 Total Problems: ${totalProblems}`);
        // console.log(`✅ Solved: ${Array.from(solved)}`);
        // console.log(`❌ Unsolved: ${unsolvedProblems}`);

        return {
          contestName: c.contestName,
          contestId: c.contestId,
          ratingUpdateTime: c.ratingUpdateTimeSeconds,
          rank: c.rank,
          oldRating: c.oldRating,
          newRating: c.newRating,
          attemptedCount: allProblems.size,
          solvedCount: solved.size,
          unsolvedCount,
          unsolvedProblems
        };
      });

    res.json(filteredContests);
  } catch (err) {
    console.error("Error fetching contest data:", err.message);
    res.status(500).json({ error: "Failed to fetch contest data" });
  }
});
module.exports = router;





