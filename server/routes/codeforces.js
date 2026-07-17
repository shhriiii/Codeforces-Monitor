


const express = require('express');
const axios = require('axios');
const router = express.Router();

const getCodeforcesResult = async (url) => {
    const response = await axios.get(url);

    if (response.data.status !== 'OK') {
        throw new Error(response.data.comment || 'Codeforces could not find that user.');
    }

    return response.data.result;
};

// Helper function to filter recent submissions
const filterSubmissionsByDays = (submissions, days) => {
    const cutoff = Date.now() / 1000 - days * 24 * 60 * 60;
    return submissions.filter(sub => sub.creationTimeSeconds >= cutoff);
};

// Route: Submission Heatmap Data
router.get("/heatmap/:handle", async (req, res) => {
    try {
        const days = parseInt(req.query.days || "365", 10);
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        const handle = encodeURIComponent(req.params.handle);
        const subs = await getCodeforcesResult(`https://codeforces.com/api/user.status?handle=${handle}`);

        const counts = {};
        subs
            .filter(sub => sub.verdict === "OK" && sub.creationTimeSeconds * 1000 >= cutoff)
            .forEach(sub => {
                const day = new Date(sub.creationTimeSeconds * 1000).setHours(0, 0, 0, 0);
                counts[day] = (counts[day] || 0) + 1;
            });

        res.json(counts);
    } catch (err) {
        res.status(502).json({ error: err.message || 'Failed to fetch Codeforces submission data.' });
    }
});

// Route: Public Codeforces profile summary
router.get('/profile/:handle', async (req, res) => {
    try {
        const handle = encodeURIComponent(req.params.handle);
        const users = await getCodeforcesResult(`https://codeforces.com/api/user.info?handles=${handle}`);
        res.json(users[0]);
    } catch (err) {
        res.status(404).json({ error: err.message || 'Codeforces user not found.' });
    }
});


// Route: Problem Solving Stats
router.get("/problems/:handle", async (req, res) => {
    const { handle } = req.params;
    const days = parseInt(req.query.days || 30);

    try {
        const allSubs = await getCodeforcesResult(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`);

        const solvedProblemIds = new Set();
        const recentAccepted = filterSubmissionsByDays(
            allSubs.filter(s => {
                if (s.verdict !== "OK" || !s.problem.rating) return false;
                const problemId = `${s.problem.contestId}-${s.problem.index}`;
                if (solvedProblemIds.has(problemId)) return false;
                solvedProblemIds.add(problemId);
                return true;
            }),
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
        res.status(502).json({ error: "Failed to fetch Codeforces problem data" });
    }
});

// Route: Contest Stats
// 
router.get("/contests/:handle", async (req, res) => {
  const { handle } = req.params;
  const days = parseInt(req.query.days || "90");

  try {
    const [allContests, allSubs] = await Promise.all([
      getCodeforcesResult(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`),
      getCodeforcesResult(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`)
    ]);

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
    res.status(502).json({ error: "Failed to fetch contest data" });
  }
});
module.exports = router;




